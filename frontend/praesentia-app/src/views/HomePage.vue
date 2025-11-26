import { api } from "../api";

onMounted(async () => {
  const res = await api.get("/students");
  console.log(res.data);
});
