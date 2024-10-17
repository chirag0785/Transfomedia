import Ably from "ably";
const ably = new Ably.Realtime(process.env.ABLY_API_KEY || "");

export default ably