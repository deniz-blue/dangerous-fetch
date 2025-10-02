import { ExtensionMessage, ExtensionResponseData } from "../../schema/command.schema";

const abortControllers = new Map<string, AbortController>();

chrome.runtime.onMessage.addListener((rawMessage, sender) => {
    const reply = (data: any) => {
        if (sender.tab && sender.tab.id !== undefined) {
            chrome.tabs.sendMessage(sender.tab.id, data);
        } else {
            chrome.runtime.sendMessage(data);
        }
    };

    const message = ExtensionMessage.parse(rawMessage);
    if (message.type == "request") {
        let {
            url,
            headers,
            method,
            referrer,
            referrerPolicy,
            id,
        } = message.data;

        if (!id) id = Math.random().toString(36);

        let controller = new AbortController();
        abortControllers.set(id, controller);

        fetch(url, {
            headers: Array.isArray(headers) ? [] : headers,
            method,
            referrer,
            referrerPolicy,
            signal: controller.signal,
        })
            .then((res) => Promise.all([res, res.bytes()]))
            .then(([res, bytes]) => {
                reply({
                    type: "response",
                    data: {
                        id,
                        url: res.url,
                        headers: Object.fromEntries(res.headers.entries()),
                        ok: res.ok,
                        redirected: res.redirected,
                        status: res.status,
                        statusText: res.statusText,
                        type: res.type,
                        body: Array.from(bytes),
                    } as ExtensionResponseData,
                });
            })
            .catch((error) => {
                if (error instanceof DOMException) {
                    reply({
                        type: "error",
                        data: {
                            id,
                            kind: "DOMException",
                            name: error.name,
                            message: error.message,
                        },
                    });
                } else if (error instanceof TypeError) {
                    reply({ type: "error", data: { id, kind: "TypeError", message: error.message } });
                } else {
                    console.log("Unknown error kind", error);
                    reply({ type: "error", data: { id, kind: "unknown", message: "" + error } });
                }
            })
            .finally(() => {
                abortControllers.delete(id);
            })

        // return true;
    } else if (message.type == "abort") {
        abortControllers.get(message.data.id)?.abort(message.data.reason);
    } else {

    }
})

console.log('background script loaded');
