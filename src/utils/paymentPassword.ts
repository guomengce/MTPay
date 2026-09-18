export const paymentPasswordPattern = /^[0-9]{6}$/;
const eventName = 'payment-security-changed';
export function notifyPaymentSecurityChanged() {
  window.dispatchEvent(new Event(eventName));
  if (typeof BroadcastChannel !== 'undefined') {
    const channel = new BroadcastChannel(eventName);
    channel.postMessage('changed');
    channel.close();
  }
}
export function onPaymentSecurityChanged(callback: () => void) {
  window.addEventListener(eventName, callback);
  const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(eventName) : null;
  if (channel) channel.onmessage = callback;
  return () => {
    window.removeEventListener(eventName, callback);
    channel?.close();
  };
}
export function paymentError(error: unknown): string {
  const failure = error as { response?: { data?: { message?: string } }; message?: string };
  return failure?.response?.data?.message || failure?.message || '';
}
