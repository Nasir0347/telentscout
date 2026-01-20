export const loadRecaptchaScript = () => {
    return new Promise((resolve, reject) => {
        const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
        if (!siteKey) {
            reject("VITE_RECAPTCHA_SITE_KEY is not defined");
            return;
        }

        if (document.getElementById('recaptcha-script')) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
        script.id = 'recaptcha-script';
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject("Failed to load reCAPTCHA script");
        document.head.appendChild(script);
    });
};

export const executeRecaptcha = async (action) => {
    try {
        await loadRecaptchaScript();

        return new Promise((resolve, reject) => {
            if (!window.grecaptcha) {
                reject("reCAPTCHA not loaded");
                return;
            }

            const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
            window.grecaptcha.ready(() => {
                window.grecaptcha.execute(siteKey, { action: action }).then((token) => {
                    resolve(token);
                }).catch(err => {
                    reject(err);
                });
            });
        });
    } catch (error) {
        console.error("Recaptcha Execution Error:", error);
        // Fallback for development if keys are missing?
        // return "dev-token-bypass"; 
        throw error;
    }
};
