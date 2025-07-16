// import axios from "axios";

// export async function getProvinces() {
//   try {
//     console.log("key", process.env.NEXT_PUBLIC_RAJA_ONGKIR_KEY);
//     const response = await axios.get(
//       "https://api.rajaongkir.com/starter/province",
//       {
//         headers: {
//           key: process.env.NEXT_PUBLIC_RAJA_ONGKIR_KEY || "", // default fallback
//         },
//       }
//     );

//     const results = response.data?.rajaongkir?.results;

//     return { status: "OK", data: results };
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       return {
//         status: "ERROR",
//         error: error.response?.data || error.message,
//       };
//     }
//     return { status: "ERROR", error: String(error) };
//   }
// }
