import Ably from "ably";
const ably = new Ably.Realtime({
    key:process.env.NEXT_PUBLIC_ABLY_KEY || "",
    disconnectedRetryTimeout:15000,
    suspendedRetryTimeout:30000,
    realtimeRequestTimeout:20000
});

export default ably