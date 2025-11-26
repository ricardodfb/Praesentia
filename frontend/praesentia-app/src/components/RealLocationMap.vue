<!-- pages/RealLocationMapa.vue -->
<template>
  <v-container fluid class="pa-4">
    <v-card elevation="4" class="rounded-lg">
      <v-card-title class="primary white--text">
        <v-icon left color="white">mdi-map-marker-radius</v-icon>
        Ubicación de Alta Precisión
      </v-card-title>

      <v-card-text class="pa-4">
        <!-- Selector de modo de precisión -->
        <v-row class="mb-4">
          <v-col cols="12">
            <v-card variant="outlined">
              <v-card-text>
                <div class="text-subtitle-1 mb-2">Modo de Precisión:</div>
                <v-radio-group v-model="precisionMode" inline>
                  <v-radio label="Rápido" value="fast"></v-radio>
                  <v-radio label="Preciso" value="precise"></v-radio>
                  <v-radio label="Máxima Precisión" value="maximum"></v-radio>
                </v-radio-group>
                
                <v-switch
                  v-model="continuousTracking"
                  label="Seguimiento continuo (mejora precisión)"
                  color="primary"
                ></v-switch>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Botones de acción -->
        <div class="text-center mb-4">
          <v-btn 
            color="primary" 
            large 
            @click="getEnhancedLocation"
            :loading="loading"
            :disabled="loading"
            class="mb-2 mr-2"
          >
            <v-icon left>mdi-crosshairs-gps</v-icon>
            {{ continuousTracking ? 'Iniciar Seguimiento' : 'Obtener Ubicación Mejorada' }}
          </v-btn>
          
          <v-btn 
            v-if="continuousTracking && isTracking"
            color="error" 
            @click="stopTracking"
            class="mb-2"
          >
            <v-icon left>mdi-stop</v-icon>
            Detener Seguimiento
          </v-btn>
        </div>

        <!-- Indicador de calidad de precisión -->
        <v-alert
          v-if="location"
          :type="getAccuracyType(location.accuracy)"
          class="mt-4"
        >
          <v-row align="center">
            <v-col cols="auto">
              <v-icon>mdi-{{ getAccuracyIcon(location.accuracy) }}</v-icon>
            </v-col>
            <v-col>
              <strong>Precisión: ±{{ location.accuracy }} metros</strong>
              <div class="text-caption">
                {{ getAccuracyDescription(location.accuracy) }}
                <span v-if="location.satellites"> • {{ location.satellites }} satélites</span>
              </div>
            </v-col>
            <v-col cols="auto">
              <v-progress-circular
                :model-value="getAccuracyScore(location.accuracy)"
                :color="getAccuracyColor(location.accuracy)"
                size="40"
              >
                {{ getAccuracyScore(location.accuracy) }}%
              </v-progress-circular>
            </v-col>
          </v-row>
        </v-alert>

        <!-- Información de ubicación -->
        <v-row v-if="location" class="mb-4">
          <v-col cols="12" md="6">
            <v-card variant="outlined" :color="getAccuracyCardColor(location.accuracy)">
              <v-card-text>
                <div class="text-h6">📍 Ubicación Encontrada</div>
                <v-divider class="my-2"></v-divider>
                <div><strong>Latitud:</strong> {{ location.lat.toFixed(8) }}</div>
                <div><strong>Longitud:</strong> {{ location.lng.toFixed(8) }}</div>
                <div><strong>Precisión:</strong> ±{{ location.accuracy }} metros</div>
                <div><strong>Actualizado:</strong> {{ lastUpdated }}</div>
                <div v-if="location.readingsCount"><strong>Lecturas:</strong> {{ location.readingsCount }}</div>
                <div v-if="location.satellites"><strong>Satélites:</strong> {{ location.satellites }}</div>
              </v-card-text>
            </v-card>
          </v-col>
          
          <v-col cols="12" md="6">
            <div class="d-flex flex-column gap-2">
              <v-btn 
                color="green" 
                :href="googleMapsUrl" 
                target="_blank"
                block
              >
                <v-icon left>mdi-google-maps</v-icon>
                Abrir en Google Maps
              </v-btn>
              
              <v-btn 
                color="blue" 
                :href="openStreetMapUrl" 
                target="_blank"
                block
              >
                <v-icon left>mdi-earth</v-icon>
                Abrir en OpenStreetMap
              </v-btn>
              
              <v-btn 
                color="orange" 
                @click="shareLocation"
                block
                v-if="canShare"
              >
                <v-icon left>mdi-share</v-icon>
                Compartir Ubicación
              </v-btn>

              <v-btn 
                color="purple" 
                @click="refineLocation"
                block
                v-if="location && location.accuracy > 20"
              >
                <v-icon left>mdi-map-marker-check</v-icon>
                Refinar Ubicación
              </v-btn>
            </div>
          </v-col>
        </v-row>

        <!-- Mapa -->
        <div class="map-container">
          <div 
            id="real-location-map" 
            class="map"
            :class="{ 'loading': loading }"
          ></div>
          <v-overlay 
            :model-value="loading" 
            class="align-center justify-center"
          >
            <v-progress-circular
              indeterminate
              size="64"
              color="primary"
            >
              <v-icon>mdi-crosshairs-gps</v-icon>
            </v-progress-circular>
            <div class="text-h6 white--text mt-4">{{ loadingMessage }}</div>
          </v-overlay>
        </div>

        <!-- Resto del template se mantiene igual -->
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import L from 'leaflet'

// Fix para los iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

export default {
  name: 'RealLocationMap',
  setup() {
    const loading = ref(false)
    const location = ref(null)
    const error = ref(null)
    const isSupported = ref(true)
    const lastUpdateTime = ref(null)
    const precisionMode = ref('precise')
    const continuousTracking = ref(false)
    const isTracking = ref(false)
    const loadingMessage = ref('Buscando tu ubicación...')
    const watchId = ref(null)
    
    let map = null
    let userMarker = null
    let accuracyCircle = null

    // Configuraciones por modo
    const precisionConfigs = {
      fast: {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 30000
      },
      precise: {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0
      },
      maximum: {
        enableHighAccuracy: true,
        timeout: 45000,
        maximumAge: 0
      }
    }

    const lastUpdated = computed(() => {
      if (!lastUpdateTime.value) return ''
      return new Date(lastUpdateTime.value).toLocaleTimeString()
    })

    const googleMapsUrl = computed(() => {
      if (!location.value) return ''
      return `https://www.google.com/maps?q=${location.value.lat},${location.value.lng}&z=16`
    })

    const openStreetMapUrl = computed(() => {
      if (!location.value) return ''
      return `https://www.openstreetmap.org/?mlat=${location.value.lat}&mlon=${location.value.lng}#map=16/${location.value.lat}/${location.value.lng}`
    })

    const canShare = computed(() => {
      return navigator.share && location.value
    })

    // Funciones de utilidad para precisión
    const getAccuracyType = (accuracy) => {
      if (accuracy <= 10) return 'success'
      if (accuracy <= 30) return 'info'
      if (accuracy <= 100) return 'warning'
      return 'error'
    }

    const getAccuracyIcon = (accuracy) => {
      if (accuracy <= 10) return 'check-circle'
      if (accuracy <= 30) return 'information'
      if (accuracy <= 100) return 'alert'
      return 'alert-circle'
    }

    const getAccuracyColor = (accuracy) => {
      if (accuracy <= 10) return 'success'
      if (accuracy <= 30) return 'info'
      if (accuracy <= 100) return 'warning'
      return 'error'
    }

    const getAccuracyCardColor = (accuracy) => {
      if (accuracy <= 10) return 'success'
      if (accuracy <= 30) return 'info'
      if (accuracy <= 100) return 'warning'
      return 'error'
    }

    const getAccuracyDescription = (accuracy) => {
      if (accuracy <= 10) return 'Excelente precisión'
      if (accuracy <= 30) return 'Buena precisión'
      if (accuracy <= 100) return 'Precisión moderada'
      return 'Precisión baja - considera moverte a un área abierta'
    }

    const getAccuracyScore = (accuracy) => {
      if (accuracy <= 5) return 100
      if (accuracy <= 20) return 90
      if (accuracy <= 50) return 70
      if (accuracy <= 100) return 50
      if (accuracy <= 500) return 30
      return 10
    }

    // ESTRATEGIA 1: Múltiples lecturas promediadas
    const getEnhancedLocation = async () => {
      if (continuousTracking.value) {
        startContinuousTracking()
        return
      }

      loading.value = true
      error.value = null
      loadingMessage.value = 'Obteniendo ubicación de alta precisión...'

      try {
        if (precisionMode.value === 'maximum') {
          await getMaximumPrecisionLocation()
        } else {
          await getStandardLocation()
        }
      } catch (err) {
        handleLocationError(err)
      }
    }

    const getStandardLocation = () => {
      return new Promise((resolve, reject) => {
        const config = precisionConfigs[precisionMode.value]
        
        navigator.geolocation.getCurrentPosition(
          (position) => {
            processPosition(position)
            resolve(position)
          },
          reject,
          config
        )
      })
    }

    // ESTRATEGIA 2: MÁXIMA PRECISIÓN - Múltiples lecturas
    const getMaximumPrecisionLocation = async () => {
      const readings = []
      const maxReadings = 8
      const minAccuracy = 15 // metros
      const maxTime = 40000 // 40 segundos máximo

      return new Promise((resolve, reject) => {
        const startTime = Date.now()
        
        watchId.value = navigator.geolocation.watchPosition(
          (position) => {
            const coords = position.coords
            
            // Solo considerar lecturas con buena precisión
            if (coords.accuracy <= 100) {
              readings.push({
                lat: coords.latitude,
                lng: coords.longitude,
                accuracy: coords.accuracy,
                timestamp: Date.now()
              })
              
              // Ordenar por precisión (mejor primero)
              readings.sort((a, b) => a.accuracy - b.accuracy)
              
              // Actualizar mensaje de carga
              loadingMessage.value = `Mejorando precisión... (${readings.length}/${maxReadings}) - Mejor: ±${readings[0]?.accuracy || 0}m`
              
              // Si tenemos una lectura muy precisa, usarla inmediatamente
              if (readings[0] && readings[0].accuracy <= minAccuracy) {
                finishTracking(readings[0])
                resolve(readings[0])
                return
              }
              
              // Si tenemos suficientes lecturas o se acabó el tiempo
              if (readings.length >= maxReadings || (Date.now() - startTime) > maxTime) {
                finishTracking(readings[0])
                resolve(readings[0])
                return
              }
            }
          },
          (err) => {
            finishTracking()
            reject(err)
          },
          {
            enableHighAccuracy: true,
            timeout: maxTime,
            maximumAge: 0
          }
        )
      })
    }

    const finishTracking = (bestReading = null) => {
      if (watchId.value) {
        navigator.geolocation.clearWatch(watchId.value)
        watchId.value = null
      }
      
      if (bestReading) {
        processPosition({
          coords: {
            latitude: bestReading.lat,
            longitude: bestReading.lng,
            accuracy: bestReading.accuracy,
            altitude: null,
            speed: null,
            heading: null
          }
        }, bestReading.readingsCount)
      }
      
      loading.value = false
    }

    // ESTRATEGIA 3: Seguimiento continuo
    const startContinuousTracking = () => {
      loading.value = true
      isTracking.value = true
      loadingMessage.value = 'Seguimiento continuo activado...'

      watchId.value = navigator.geolocation.watchPosition(
        (position) => {
          // Solo actualizar si la precisión mejora significativamente
          if (!location.value || position.coords.accuracy < location.value.accuracy * 0.8) {
            processPosition(position)
          }
          loading.value = false
        },
        (err) => {
          handleLocationError(err)
          loading.value = false
        },
        {
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: 5000 // Solo usar datos de menos de 5 segundos
        }
      )
    }

    const stopTracking = () => {
      if (watchId.value) {
        navigator.geolocation.clearWatch(watchId.value)
        watchId.value = null
      }
      isTracking.value = false
      loading.value = false
    }

    // ESTRATEGIA 4: Refinamiento de ubicación
    const refineLocation = async () => {
      if (!location.value) return
      
      loading.value = true
      loadingMessage.value = 'Refinando ubicación...'
      
      // Tomar 3 lecturas rápidas adicionales
      const refinements = []
      
      try {
        for (let i = 0; i < 3; i++) {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0
            })
          })
          refinements.push(position.coords)
          loadingMessage.value = `Refinando... (${i + 1}/3)`
        }
        
        // Promediar las lecturas
        const avgLat = refinements.reduce((sum, coord) => sum + coord.latitude, 0) / refinements.length
        const avgLng = refinements.reduce((sum, coord) => sum + coord.longitude, 0) / refinements.length
        const avgAccuracy = refinements.reduce((sum, coord) => sum + coord.accuracy, 0) / refinements.length
        
        location.value = {
          ...location.value,
          lat: avgLat,
          lng: avgLng,
          accuracy: Math.round(avgAccuracy),
          readingsCount: (location.value.readingsCount || 1) + refinements.length
        }
        
        updateMapLocation(avgLat, avgLng, avgAccuracy)
      } catch (err) {
        console.error('Error refinando ubicación:', err)
      } finally {
        loading.value = false
      }
    }

    const processPosition = (position, readingsCount = 1) => {
      const coords = position.coords
      location.value = {
        lat: coords.latitude,
        lng: coords.longitude,
        accuracy: Math.round(coords.accuracy),
        altitude: coords.altitude,
        speed: coords.speed,
        heading: coords.heading,
        readingsCount: readingsCount,
        satellites: estimateSatellites(coords.accuracy)
      }
      
      lastUpdateTime.value = Date.now()
      updateMapLocation(coords.latitude, coords.longitude, coords.accuracy)
      loading.value = false
    }

    const estimateSatellites = (accuracy) => {
      if (accuracy <= 5) return '8+'
      if (accuracy <= 10) return '6-8'
      if (accuracy <= 20) return '4-6'
      if (accuracy <= 50) return '3-5'
      return '1-3'
    }

    // El resto de las funciones (initializeMap, updateMapLocation, etc.) se mantienen igual
    const initializeMap = () => {
      if (!map) {
        map = L.map('real-location-map').setView([0, 0], 2)
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(map)
      }
    }

    const updateMapLocation = (lat, lng, accuracy) => {
      if (!map) return

      map.setView([lat, lng], 16)

      if (userMarker) {
        map.removeLayer(userMarker)
      }
      if (accuracyCircle) {
        map.removeLayer(accuracyCircle)
      }

      const customIcon = L.divIcon({
        html: `
          <div style="
            background-color: #1976D2;
            border: 3px solid white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          "></div>
        `,
        className: 'custom-location-marker',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      })

      userMarker = L.marker([lat, lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(`
          <div style="text-align: center;">
            <strong>¡Tu ubicación actual!</strong><br>
            Lat: ${lat.toFixed(8)}<br>
            Lng: ${lng.toFixed(8)}<br>
            <small>Precisión: ±${accuracy} metros</small>
          </div>
        `)
        .openPopup()

      accuracyCircle = L.circle([lat, lng], {
        radius: accuracy,
        fillColor: '#1976D2',
        fillOpacity: 0.1,
        color: '#1976D2',
        weight: 2,
        opacity: 0.5
      }).addTo(map)
    }

    const handleLocationError = (err) => {
      loading.value = false
      isTracking.value = false
      
      switch(err.code) {
        case err.PERMISSION_DENIED:
          error.value = 'Permiso de ubicación denegado. Por favor, permite el acceso a tu ubicación en la configuración del navegador.'
          break
        case err.POSITION_UNAVAILABLE:
          error.value = 'No se pudo obtener tu ubicación. Verifica tu conexión, GPS y que estés en un lugar con buena señal (área abierta).'
          break
        case err.TIMEOUT:
          error.value = 'Tiempo de espera agotado. El GPS está tomando más tiempo de lo normal. Intenta en un área con mejor recepción.'
          break
        default:
          error.value = 'Error desconocido al obtener la ubicación.'
      }
    }

    const shareLocation = async () => {
      if (!location.value) return

      try {
        await navigator.share({
          title: 'Mi ubicación actual',
          text: `Estoy aquí ahora mismo (Precisión: ±${location.value.accuracy} metros)`,
          url: googleMapsUrl.value
        })
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err)
        }
      }
    }

    onMounted(() => {
      setTimeout(() => {
        initializeMap()
      }, 100)
    })

    return {
      loading,
      location,
      error,
      isSupported,
      lastUpdated,
      googleMapsUrl,
      openStreetMapUrl,
      canShare,
      precisionMode,
      continuousTracking,
      isTracking,
      loadingMessage,
      getEnhancedLocation,
      stopTracking,
      refineLocation,
      shareLocation,
      getAccuracyType,
      getAccuracyIcon,
      getAccuracyColor,
      getAccuracyCardColor,
      getAccuracyDescription,
      getAccuracyScore
    }
  }
}
</script>

<style scoped>
.map-container {
  position: relative;
  height: 500px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #e0e0e0;
}

.map {
  width: 100%;
  height: 100%;
  transition: opacity 0.3s ease;
}

.map.loading {
  opacity: 0.5;
}

:deep(.custom-location-marker) {
  background: transparent !important;
  border: none !important;
}

:deep(.leaflet-popup-content) {
  margin: 12px 16px;
  font-family: 'Roboto', sans-serif;
}

:deep(.leaflet-popup-content-wrapper) {
  border-radius: 8px;
}
</style>