/*
# Attributes
    data-motion-enabled="true" → enable/disable motion (default true)
    data-motion="fade-up" → animation name
    data-motion-stagger="0.2" → delay each child by 0.2s
    data-motion-once="true" → animate only first time
    data-motion-delay="200" → individual child delay in ms
    data-motion-duration="800" → individual child duration in ms
    data-motion-easing="ease-out" → easing function
    data-motion-keyframes='{"opacity":[0,1],"scale":[0.5,1]}' → custom keyframes
*/

(function () {
    if (! window.Motion) {
        console.error("❌ Motion One not found. Please include Motion (https://motion.dev) before motion-presets.js");
        return;
    }

    const { animate, inView } = window.Motion;

    let presets = {
        "fade-in": { keyframes: { opacity: [0, 1] }, defaults: { duration: 0.8, easing: "ease-out" } },
        "fade-out": { keyframes: { opacity: [1, 0] }, defaults: { duration: 0.8, easing: "ease-out" } },
        "fade-up": { keyframes: { opacity: [0, 1], transform: ["translateY(30px)", "translateY(0)"] }, defaults: { duration: 0.8, easing: "ease-out" } },
        "fade-down": { keyframes: { opacity: [0, 1], transform: ["translateY(-30px)", "translateY(0)"] }, defaults: { duration: 0.8, easing: "ease-out" } },
        "fade-left": { keyframes: { opacity: [0, 1], transform: ["translateX(30px)", "translateX(0)"] }, defaults: { duration: 0.8, easing: "ease-out" } },
        "fade-right": { keyframes: { opacity: [0, 1], transform: ["translateX(-30px)", "translateX(0)"] }, defaults: { duration: 0.8, easing: "ease-out" } },
        "zoom-in": { keyframes: { opacity: [0, 1], transform: ["scale(0.9)", "scale(1)"] }, defaults: { duration: 0.8, easing: "ease-out" } },
        "zoom-out": { keyframes: { opacity: [0, 1], transform: ["scale(1.2)", "scale(1)"] }, defaults: { duration: 0.8, easing: "ease-out" } },
        "zoom-in-down": { keyframes: { opacity: [0, 1], transform: ["translateY(-150px) scale(0.8)", "translateY(0) scale(1)"] }, defaults: { duration: 0.8, easing: "ease-out" } },
        "rotate-in": { keyframes: { opacity: [0, 1], transform: ["rotate(-10deg) scale(0.9)", "rotate(0deg) scale(1)"] }, defaults: { duration: 0.9, easing: "ease-out" } },
        "flip-x": { keyframes: { opacity: [0, 1], transform: ["rotateX(20deg)", "rotateX(0deg)"] }, defaults: { duration: 0.9, easing: "ease-out" } },
        "flip-y": { keyframes: { opacity: [0, 1], transform: ["rotateY(20deg)", "rotateY(0deg)"] }, defaults: { duration: 0.9, easing: "ease-out" } },
    };

    function parseJSONAttr(attr) {
        try { return JSON.parse(attr); } catch { console.warn("⚠️ Invalid JSON in data-motion-keyframes:", attr); return null; }
    }

    function animateElement(el, keyframes, options, once) {
        if (el.getAttribute("data-has-container") && el.querySelector(".container")) {
            el = el.querySelector(".container");
        }

        // Don't set initial styles immediately - let elements be visible
        // Only animate when element comes into view
        try {
            inView(el, (info) => {
                // Animate from initial state to final state
                const animation = animate(el, keyframes, options);

                // If once is false, we want to keep the final state when element leaves view
                // Only reset to initial state if once is true
                if (once) {
                    return () => {
                        // Reset to initial state when element leaves view (only for once=true)
                        if (keyframes.opacity) {
                            el.style.opacity = keyframes.opacity[0];
                        }
                        if (keyframes.transform) {
                            el.style.transform = Array.isArray(keyframes.transform) ? keyframes.transform[0] : keyframes.transform;
                        }
                    };
                } else {
                    // For once=false, keep the final state when element leaves view
                    // This ensures elements stay visible when scrolling back
                    return () => {
                        // Keep final state - do nothing
                    };
                }

                return animation;
            }, {
                margin: "10px",
                amount: "some"
            });
        } catch (error) {
            console.warn("Motion animation failed for element:", el, error);
            // If animation fails, ensure element is visible
            el.style.opacity = "";
            el.style.transform = "";
        }
    }

    function init(el, options = {}) {
        if (! hasEnabled(el)) {
            return;
        }

        const stagger = parseFloat(el.dataset.motionStagger || 0);

        if (stagger > 0) {
            // Check if parent has data-motion-delay="0" for global override
            const parentDelayOverride = el.dataset.motionDelay === "0";

            // Get exclude selectors if they exist
            const excludeSelector = el.dataset.motionStaggerExclude || "";
            const excludeSelectors = excludeSelector ? excludeSelector.split(",").map(s => s.trim()) : [];

            // Animate children with stagger
            const children = Array.from(el.children);
            children.forEach((child, i) => {
                // Check if this child should be excluded from stagger
                let isExcluded = false;
                if (excludeSelectors.length > 0) {
                    isExcluded = excludeSelectors.some(selector => {
                        try {
                            // Handle special selectors like :first, :last
                            if (selector === ":first") {
                                return child === children[0];
                            } else if (selector === ":last") {
                                return child === children[children.length - 1];
                            } else {
                                // Handle regular CSS selectors
                                return child.matches(selector);
                            }
                        } catch (e) {
                            console.warn("Invalid CSS selector in data-motion-stagger-exclude:", selector);
                            return false;
                        }
                    });
                }

                if (child.querySelector(".container")) {
                    child.setAttribute("data-has-container", "true");
                }

                let delay;

                if (parentDelayOverride) {
                    // If parent has data-motion-delay="0", apply 0 delay to all children
                    delay = 0;
                } else {
                    // Check if the child has an explicit delay of 0
                    const childDelay = child.dataset.motionDelay;

                    if (childDelay === "0") {
                        // If explicitly set to 0, use 0 delay
                        delay = 0;
                    } else {
                        // Otherwise use the standard calculation
                        const baseDelay = 0.01; // Reduced base delay for quicker start
                        delay = baseDelay + (parseInt(childDelay || 0) / 1000) + i * stagger;
                    }
                }

                // If the child is excluded, skip the animation but keep the delay logic
                if (isExcluded) {
                    // Make sure the element is visible immediately
                    child.style.opacity = "";
                    child.style.transform = "";
                    return; // Skip animation for this child
                }

                const animType = child.dataset.motion || el.dataset.motion;
                let preset = presets[animType];
                let keyframes = preset ? preset.keyframes : null;
                let defaults = preset ? preset.defaults : { duration: 0.7 };

                if (child.dataset.motionKeyframes) {
                    const custom = parseJSONAttr(child.dataset.motionKeyframes);
                    if (custom) keyframes = custom;
                }

                if (!keyframes) return;

                // Keep duration at 0.7s for a good balance between smoothness and speed
                const duration = child.dataset.motionDuration ? parseInt(child.dataset.motionDuration)/1000 : 0.7;
                const easing = child.dataset.motionEasing || defaults.easing || "ease-out";
                // Changed default to false so animations replay on scroll back
                const once = child.dataset.motionOnce === "true" || (child.dataset.motionOnce !== "false" && el.dataset.motionOnce === "true") || false;

                animateElement(child, keyframes, { ...defaults, delay, duration, easing }, once);
            });
        } else {
            // Animate element itself
            const animType = el.dataset.motion;
            let preset = presets[animType];
            let keyframes = preset ? preset.keyframes : null;
            let defaults = preset ? preset.defaults : { duration: 0.7 };

            if (el.dataset.motionKeyframes) {
                const custom = parseJSONAttr(el.dataset.motionKeyframes);
                if (custom) keyframes = custom;
            }

            if (!keyframes) return;

            const delay = el.dataset.motionDelay ? parseInt(el.dataset.motionDelay)/1000 : 0;
            const duration = el.dataset.motionDuration ? parseInt(el.dataset.motionDuration)/1000 : defaults.duration;
            const easing = el.dataset.motionEasing || defaults.easing || "ease-out";
            const once = el.dataset.motionOnce === "true" || (el.dataset.motionOnce !== "false" && el.dataset.motionOnce === "true") || false;

            animateElement(el, keyframes, { ...defaults, delay, duration, easing }, once);
        }
    }

    function hasEnabled(el = null) {
        el = el || document.body;

        if (el?.getAttribute("data-motion-enabled") === "false") {
            return false;
        }

        return true;
    }

    // Add a function to re-initialize motion animations
    function reinit(options = {}) {
        if (! hasEnabled()) {
            return;
        }

        const root = options.el ?? document;
        root.querySelectorAll("[data-motion]").forEach(el => init(el, options));
    }

    window.MotionPresets = {
        init: function (options = {}) {
            if (! hasEnabled()) {
                return;
            }

            // Add a small delay to prevent scroll jumps on page load
            setTimeout(() => {
                const root = options.el ?? document;
                root.querySelectorAll("[data-motion]").forEach(el => init(el, options));
            }, 50);
        },
        // Add reinit function to manually trigger animation initialization
        reinit: reinit
    };
})();
