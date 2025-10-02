window.onmessage = (ev) => {
	if (ev.source !== window) return;
	if (!("__dangerousFetch" in ev.data) || ev.data.__dangerousFetch !== "_toBackend") return;

	chrome.runtime.sendMessage(ev.data);
};

chrome.runtime.onMessage.addListener((rawMessage, sender, sendResponse) => {
	window.postMessage({
		...rawMessage,
		__dangerousFetch: "_toFrontend",
	})
});

interface Window {
	dangerousFetch: (url: string, init?: RequestInit) => Promise<Response>;
}

let script = document.createElement('script');
script.textContent = `(${() => {
	const callbacks = new Map<string, [(r: Response) => void, (e: any) => void]>();

	window.addEventListener("message", (ev) => {
		if(ev.source !== window) return;
		if (!("__dangerousFetch" in ev.data) || ev.data.__dangerousFetch !== "_toFrontend") return;
		if(ev.data.type == "error") {
			let rej = callbacks.get(ev.data.data.id)?.[1];
			if(ev.data.data.kind == "DOMException") {
				rej?.(new DOMException(ev.data.data.message, ev.data.data.name));
			} else if(ev.data.data.kind == "TypeError") {
				rej?.(new TypeError(ev.data.data.message));
			} else {
				rej?.(new Error(ev.data.data.message));
			}
		} else if(ev.data.type == "response") {
			let res = callbacks.get(ev.data.data.id)?.[0];
			res?.(new Response(new Uint8Array(ev.data.data.body), {
				headers: ev.data.data.headers,
				status: ev.data.data.status,
				statusText: ev.data.data.statusText,
			}));
		}
	});

	window.dangerousFetch = (url, init) => new Promise((res, rej) => {
		const id = Math.random().toString(36);
		callbacks.set(id, [res, rej]);
		window.postMessage({
			__dangerousFetch: "_toBackend",
			type: "request",
			data: {
				...init,
				id,
				url,
			},
		});
	});
}})()`;
(document.head || document.documentElement).appendChild(script);
script.parentNode?.removeChild(script);

console.log("[DangerousFetch] Initialized");
