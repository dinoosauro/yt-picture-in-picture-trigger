// ==UserScript==
// @name    YouTube Picture-in-Picture
// @description Enables Picture-in-Picture mode on YouTube
// @author  dinoosauro
// @license mit
// @match   *://*.youtube.com/*
// @version 1.0.0
// @namespace   https://github.com/dinoosauro/yt-picture-in-picture-trigger
// ==/UserScript==

(() => {
    const isMobile = window.location.hostname.startsWith("m.");
    const selector = isMobile ? ".slim-video-action-bar-actions" : "ytd-watch-metadata ytd-menu-renderer #top-level-buttons-computed";
    /**
     * The main container for the button
     */
    const main = document.createElement(`${isMobile ? "" : "yt-"}button-view-model`);
    isMobile ? main.classList.add("yt-spec-button-view-model", "slim_video_action_bar_renderer_button") : main.classList.add("ytd-menu-renderer");
    main.onclick = () => {
        document.pictureInPictureElement ? document.exitPictureInPicture() : document.querySelector("video").requestPictureInPicture();
    };
    /**
     * Create the Picture-in-Picture button
     */
    const mainFn = (() => {
        if (main.parentElement) return;
        const btnView = document.createElement(isMobile ? "yt-button-shape" : "button-view-model");
        isMobile ? btnView.classList.add("yt-spec-button-shape-next__button-shape-wiz-class") : btnView.classList.add("yt-spec-button-view-model", "style-scope", "ytd-menu-renderer");
        const btn = document.createElement("button");
        btn.classList.add("yt-spec-button-shape-next", "yt-spec-button-shape-next--tonal", "yt-spec-button-shape-next--mono", "yt-spec-button-shape-next--size-m", "yt-spec-button-shape-next--icon-leading");

        // The Picture-in-Picture icon, provided from Microsoft's Fluent UI Icons (since Google's Material Design icons are too big)
        const iconContainer = document.createElement("div");
        iconContainer.classList.add("yt-spec-button-shape-next__icon");
        iconContainer.setAttribute("aria-hidden", "true");
        const c3Icon = Object.assign(document.createElement("c3-icon"), { style: "width: 24px; height: 24px;" });
        const shapeSpan = document.createElement("span");
        shapeSpan.classList.add("yt-icon-shape", "yt-spec-icon-shape");
        const shapeDiv = Object.assign(document.createElement("div"), {
            style: "width: 100%; height: 100%; display: block; fill: currentcolor;",
            innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24" focusable="false" aria-hidden="true" style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path d="M2 6.25C2 4.45507 3.45507 3 5.25 3H18.75C20.5449 3 22 4.45507 22 6.25V12H20.5V6.25C20.5 5.2835 19.7165 4.5 18.75 4.5H5.25C4.2835 4.5 3.5 5.2835 3.5 6.25V15.75C3.5 16.7165 4.2835 17.5 5.25 17.5H11V19H5.25C3.45507 19 2 17.5449 2 15.75V6.25ZM14 13C12.8954 13 12 13.8954 12 15V20C12 21.1046 12.8954 22 14 22H21C22.1046 22 23 21.1046 23 20V15C23 13.8954 22.1046 13 21 13H14Z"></path></svg>` // Icon from Fluent UI System Icons: https://github.com/microsoft/fluentui-system-icons/blob/main/assets/Picture%20In%20Picture/SVG/ic_fluent_picture_in_picture_24_regular.svg
        });
        shapeSpan.append(shapeDiv);
        c3Icon.append(shapeSpan);
        iconContainer.append(c3Icon);

        // Create the "Picture-in-Picture" text
        const text = Object.assign(document.createElement("div"), { textContent: "Picture-in-Picture" });
        text.classList.add("yt-spec-button-shape-next__button-text-content");


        // Touch annimation div
        const touch = Object.assign(document.createElement("yt-touch-feedback-shape"), { style: "border-radius: inherit;" });
        const touchDiv = document.createElement("div");
        touchDiv.classList.add("yt-spec-touch-feedback-shape", "yt-spec-touch-feedback-shape--touch-response");

        // Append everything to the main div
        touch.append(touchDiv);
        btn.append(iconContainer, text, touchDiv);
        btnView.append(btn);
        main.append(btnView);
        document.querySelector(selector).append(main);
        console.log(main);
    });

    /**
     * Check that everything is working
     */
    const check = (() => {
        if (window.location.pathname !== "/watch" || main.parentElement) return;
        if (document.querySelector(selector)) { // It's the div where the buttons are appended
            mainFn();
            if (!main.parentElement) setTimeout(() => check(), 1000); // main hasn't been added, we'll retry in a second
        } else setTimeout(() => check(), 1000); // Let's wait another second so that the page can load.
    })
    check();

    // Check if the URL has changed (for example, the user has opened a video)
    let url = window.location.href;
    setInterval(() => {
        if (url !== window.location.href) {
            url = window.location.href;
            check();
        }
    }, 1000);


})()
