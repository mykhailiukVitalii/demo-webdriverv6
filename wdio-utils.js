const { WD_DEBUG_PORT, WD_DEBUG_HOST, WD_DEBUG_INSECURE } = process.env;
const chromeArgs = [
    {type: "PORT", value: WD_DEBUG_PORT},
    {type: "HOST", value: WD_DEBUG_HOST},
    {type: "INSECURE", value: WD_DEBUG_INSECURE}
].reduce((acc, {type, value}) => {
    if (typeof value === "undefined") {
        return acc;
    }

    switch (type) {
        case "PORT":
            acc.push('--remote-debugging-port=' + value);
            break;
        case "HOST":
            acc.push('--remote-debugging-host=' + value);
            break;
        case "INSECURE":
            if (value === 'true') {
                acc = [
                    ...acc,
                    "--ignore-certificate-errors",
                    "--ignore-ssl-errors",
                    "--ignore-certificate-errors-spki-list"
                ];
            }
            break;
    }
    return acc;
}, []);


module.exports = {
    chromeArgs
};