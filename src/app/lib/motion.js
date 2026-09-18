/* Sixteen Oaks motion system.
 * Progressive enhancement: every route, link and piece of content works without JS.
 * One-shot transform/opacity reveals, no scroll-linked motion or perpetual animation.
 */
export default function initializeMotion() {
  "use strict";
  const root = document.documentElement;
  const systemMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const desktop = matchMedia("(min-width: 961px)");
  const motionButton = document.querySelector(".motion-toggle");
  const dialog = document.querySelector(".mobile-menu");
  const menuButton = document.querySelector(".menu-toggle");
  const announcement = document.getElementById("page-announcement");
  const header = document.querySelector(".site-header");
  const allowedPaths = new Set(["/", "/services/", "/work/", "/approach/"]);
  const activeAnimations = new Set();
  const routeAnimations = new Set();
  let preference = "system";
  let revealObserver;
  let controller;
  let transition;
  let navigationId = 0;
  let currentPath = location.pathname;
  let currentSearch = location.search;
  let menuIsClosing = false;
  let menuClosePromise = Promise.resolve();
  let statusTimer;
  try {
    preference =
      localStorage.getItem("sixteen-oaks-motion") === "reduce"
        ? "reduce"
        : "system";
  } catch {}

  const isReduced = () => systemMotion.matches || preference === "reduce";
  const time = (value) =>
    value.trim().endsWith("ms") ? parseFloat(value) : parseFloat(value) * 1000;
  function tokens() {
    const style = getComputedStyle(root);
    return {
      ui: time(style.getPropertyValue("--motion-ui")),
      reveal: time(style.getPropertyValue("--motion-reveal")),
      stagger: time(style.getPropertyValue("--motion-stagger")),
      distance: parseFloat(style.getPropertyValue("--motion-distance")),
      exit: time(style.getPropertyValue("--page-exit")),
      enter: time(style.getPropertyValue("--page-enter")),
      ease: style.getPropertyValue("--ease-out").trim(),
    };
  }
  function animate(element, frames, options, route = false) {
    if (!element?.animate || isReduced() || document.hidden) return null;
    const animation = element.animate(frames, options);
    activeAnimations.add(animation);
    if (route) routeAnimations.add(animation);
    animation.finished
      .catch(() => {})
      .finally(() => {
        activeAnimations.delete(animation);
        // A route exit retains its last frame until the content is replaced.
        if (options.fill !== "both") routeAnimations.delete(animation);
      });
    return animation;
  }
  const finish = (animation) =>
    animation?.finished.catch(() => {}) ?? Promise.resolve();
  function cancelRouteAnimations() {
    routeAnimations.forEach((animation) => animation.cancel());
    routeAnimations.clear();
  }
  function observeReveals(scope = document.getElementById("main")) {
    revealObserver?.disconnect();
    if (isReduced() || !("IntersectionObserver" in window)) return;
    const config = tokens();
    revealObserver = new IntersectionObserver(
      (entries) => {
        let order = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          revealObserver.unobserve(entry.target);
          if (isReduced()) continue;
          animate(
            entry.target,
            [
              { opacity: 0, transform: `translateY(${config.distance}px)` },
              { opacity: 1, transform: "translateY(0)" },
            ],
            {
              duration: config.reveal,
              delay: Math.min(order++ * config.stagger, 120),
              easing: config.ease,
              fill: "backwards",
            },
          );
        }
      },
      { threshold: 0, rootMargin: "0px 0px -24px 0px" },
    );
    scope.querySelectorAll("[data-reveal]").forEach((element) => {
      // Visible/restored content never disappears just to replay an entrance.
      if (element.getBoundingClientRect().top >= innerHeight - 24)
        revealObserver.observe(element);
    });
  }
  function applyMotionPreference() {
    root.dataset.motion = isReduced() ? "off" : "on";
    if (isReduced()) {
      window.scrollTo({ left: scrollX, top: scrollY, behavior: "instant" });
      activeAnimations.forEach((animation) => animation.cancel());
      cancelRouteAnimations();
      transition?.skipTransition();
      revealObserver?.disconnect();
    } else {
      observeReveals();
    }
    motionButton.hidden = false;
    motionButton.disabled = systemMotion.matches;
    motionButton.setAttribute("aria-pressed", String(isReduced()));
    motionButton.querySelector("span").textContent = systemMotion.matches
      ? "Reduced motion · device setting"
      : preference === "reduce"
        ? "Use device motion setting"
        : "Reduce motion";
    motionButton.title = systemMotion.matches
      ? "Your device preference keeps all animations off."
      : preference === "reduce"
        ? "Return to your device’s motion preference."
        : "Turn off animations on this site.";
  }
  motionButton.addEventListener("click", () => {
    preference = preference === "reduce" ? "system" : "reduce";
    try {
      localStorage.setItem("sixteen-oaks-motion", preference);
    } catch {}
    applyMotionPreference();
    announcement.textContent = isReduced()
      ? "Motion reduced."
      : "Motion follows your device setting.";
  });
  systemMotion.addEventListener("change", applyMotionPreference);
  window.addEventListener("storage", (event) => {
    if (event.key === "sixteen-oaks-motion" || event.key === null) {
      preference = event.newValue === "reduce" ? "reduce" : "system";
      applyMotionPreference();
    }
  });

  function openMenu() {
    if (dialog.open || menuIsClosing) return;
    dialog.showModal();
    document.body.classList.add("menu-open");
    menuButton.setAttribute("aria-expanded", "true");
    const config = tokens();
    animate(
      dialog,
      [
        { opacity: 0, transform: "translateY(-8px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: config.ui + 70, easing: config.ease },
    );
    dialog.querySelectorAll(".mobile-links a").forEach((item, index) => {
      animate(
        item,
        [
          { opacity: 0, transform: "translateY(7px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: config.ui + 50,
          delay: index * 30,
          easing: config.ease,
          fill: "backwards",
        },
      );
    });
  }
  function closeMenu(restoreFocus = true) {
    if (menuIsClosing) return menuClosePromise;
    if (!dialog.open) return Promise.resolve();
    menuIsClosing = true;
    menuClosePromise = (async () => {
      const config = tokens();
      await finish(
        animate(dialog, [{ opacity: 1 }, { opacity: 0 }], {
          duration: Math.min(config.ui, 160),
          easing: config.ease,
        }),
      );
      dialog.close();
      document.body.classList.remove("menu-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuIsClosing = false;
      if (restoreFocus && !desktop.matches)
        menuButton.focus({ preventScroll: true });
    })();
    return menuClosePromise;
  }
  menuButton.addEventListener("click", openMenu);
  dialog
    .querySelector(".menu-close")
    .addEventListener("click", () => closeMenu());
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeMenu();
  });
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
      closeMenu();
  });
  desktop.addEventListener("change", (event) => {
    if (event.matches) closeMenu(false);
  });

  function saveScroll() {
    // Merge with host/framework state; never overwrite unrelated history data.
    history.replaceState(
      { ...history.state, oaksScroll: [scrollX, scrollY] },
      "",
    );
  }
  function hashTarget(hash) {
    if (!hash) return null;
    try {
      return document.getElementById(decodeURIComponent(hash.slice(1)));
    } catch {
      return null;
    }
  }
  function focusContent(target) {
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  }
  function positionPage(
    url,
    position,
    smooth = false,
    useSavedPosition = false,
  ) {
    const target = hashTarget(url.hash);
    if (useSavedPosition && position) {
      focusContent(document.getElementById("main"));
      window.scrollTo({
        left: position[0],
        top: position[1],
        behavior: "instant",
      });
    } else if (target) {
      focusContent(target);
      target.scrollIntoView({
        behavior: smooth && !isReduced() ? "smooth" : "instant",
        block: "start",
      });
    } else {
      focusContent(document.getElementById("main"));
      window.scrollTo({
        left: position?.[0] ?? 0,
        top: position?.[1] ?? 0,
        behavior: "instant",
      });
    }
  }
  function updateNavigation(path) {
    document
      .querySelectorAll(".desktop-nav a, .mobile-links a")
      .forEach((anchor) => {
        const url = new URL(anchor.href);
        if (url.hash === "#contact") {
          anchor.setAttribute("href", `${path}#contact`);
          return;
        }
        if (url.pathname === path || (url.pathname === "/work/" && path.startsWith("/work/"))) anchor.setAttribute("aria-current", "page");
        else anchor.removeAttribute("aria-current");
      });
    document
      .querySelector(".header-cta")
      .setAttribute("href", `${path}#contact`);
  }
  function updateMetadata(page) {
    document.title = page.title;
    for (const selector of [
      'meta[name="description"]',
      'meta[property="og:title"]',
      'meta[property="og:description"]',
      'meta[property="og:url"]',
      'meta[name="twitter:title"]',
      'meta[name="twitter:description"]',
      'meta[name="robots"]',
      'link[rel="canonical"]',
      'script[data-site-schema]',
    ]) {
      const incoming = page.querySelector(selector);
      const current = document.head.querySelector(selector);
      if (incoming) {
        if (current) current.replaceWith(incoming.cloneNode(true));
        else document.head.append(incoming.cloneNode(true));
      } else current?.remove();
    }
  }
  function setLoading(loading) {
    clearTimeout(statusTimer);
    if (loading)
      statusTimer = setTimeout(() => {
        root.dataset.navigating = "true";
        announcement.textContent = "Loading page.";
      }, 220);
    else delete root.dataset.navigating;
  }
  async function navigate(url, mode = "push", restoredPosition = null) {
    const requestId = ++navigationId;
    controller?.abort();
    transition?.skipTransition();
    cancelRouteAnimations();
    const requestController = new AbortController();
    controller = requestController;
    if (mode === "push") saveScroll();
    const closing = closeMenu(false);
    setLoading(true);
    try {
      // Keep the current page interactive and visible until its replacement is ready.
      const response = await fetch(url.pathname + url.search, {
        signal: requestController.signal,
        headers: { Accept: "text/html" },
      });
      if (
        !response.ok ||
        !response.headers.get("content-type")?.includes("text/html")
      )
        throw new Error("Page unavailable");
      const page = new DOMParser().parseFromString(
        await response.text(),
        "text/html",
      );
      const replacement = page.getElementById("main");
      if (!replacement || !page.querySelector(".site-header"))
        throw new Error("Unexpected page");
      await closing;
      if (requestId !== navigationId) return;
      // Page fades and initial hero entrances never stack on top of each other.
      replacement
        .querySelectorAll("[data-hero], .hero-image-frame img")
        .forEach((element) => {
          element.style.animation = "none";
        });
      const update = () => {
        if (requestId !== navigationId) return;
        revealObserver?.disconnect();
        document.getElementById("main").replaceWith(replacement);
        updateMetadata(page);
        if (mode === "push")
          history.pushState(
            { oaksScroll: [0, 0] },
            "",
            url.pathname + url.search + url.hash,
          );
        currentPath = url.pathname;
        currentSearch = url.search;
        updateNavigation(currentPath);
        positionPage(url, restoredPosition, false, mode === "pop");
        observeReveals(replacement);
      };
      const config = tokens();
      if (isReduced() || document.hidden) update();
      else if (typeof document.startViewTransition === "function") {
        transition = document.startViewTransition(update);
        await transition.finished.catch(() => {});
      } else {
        const leaving = animate(
          document.getElementById("main"),
          [{ opacity: 1 }, { opacity: 0 }],
          { duration: config.exit, easing: config.ease, fill: "both" },
          true,
        );
        await finish(leaving);
        if (requestId !== navigationId) {
          leaving?.cancel();
          return;
        }
        update();
        leaving?.cancel();
        await finish(
          animate(
            replacement,
            [{ opacity: 0 }, { opacity: 1 }],
            { duration: config.enter, easing: config.ease },
            true,
          ),
        );
      }
      if (requestId === navigationId) {
        saveScroll();
        announcement.textContent = `${page.title.split(" | ")[0]}. Page loaded.`;
      }
    } catch (error) {
      // A real link remains the reliable fallback, including offline/server failures.
      if (error.name !== "AbortError" && requestId === navigationId)
        location.assign(url.href);
    } finally {
      if (requestId === navigationId) {
        setLoading(false);
        cancelRouteAnimations();
      }
    }
  }

  document.addEventListener("click", async (event) => {
    const anchor = event.target.closest?.("a[href]");
    if (
      !anchor ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      anchor.hasAttribute("download") ||
      (anchor.target && anchor.target !== "_self")
    )
      return;
    const url = new URL(anchor.href, location.href);
    if (url.origin !== location.origin || (!allowedPaths.has(url.pathname) && !/^\/work\/[a-z0-9]+(?:-[a-z0-9]+)*\/$/.test(url.pathname)))
      return;
    event.preventDefault();
    if (url.pathname === currentPath && url.search === currentSearch) {
      // A same-page request also supersedes an in-flight page request.
      const samePageId = ++navigationId;
      controller?.abort();
      transition?.skipTransition();
      cancelRouteAnimations();
      setLoading(false);
      await closeMenu(false);
      if (samePageId !== navigationId) return;
      saveScroll();
      if (url.href !== location.href)
        history.pushState(
          { oaksScroll: [0, 0] },
          "",
          url.pathname + url.search + url.hash,
        );
      positionPage(url, [0, 0], true);
    } else navigate(url);
  });
  window.addEventListener("popstate", (event) => {
    const url = new URL(location.href);
    if (url.pathname === currentPath && url.search === currentSearch) {
      const popId = ++navigationId;
      controller?.abort();
      transition?.skipTransition();
      cancelRouteAnimations();
      setLoading(false);
      closeMenu(false).then(() => {
        if (popId !== navigationId) return;
        // History uses the exact saved position, even when the URL has an anchor.
        const position = event.state?.oaksScroll;
        if (position) {
          focusContent(document.getElementById("main"));
          window.scrollTo({
            left: position[0],
            top: position[1],
            behavior: "instant",
          });
        } else positionPage(url, [0, 0]);
      });
    } else navigate(url, "pop", event.state?.oaksScroll);
  });
  let framePending = false;
  let lastHistorySave = 0;
  window.addEventListener(
    "scroll",
    () => {
      if (framePending) return;
      framePending = true;
      requestAnimationFrame(() => {
        header.classList.toggle("is-scrolled", scrollY > 20);
        if (
          performance.now() - lastHistorySave > 150 &&
          location.pathname === currentPath
        ) {
          saveScroll();
          lastHistorySave = performance.now();
        }
        framePending = false;
      });
    },
    { passive: true },
  );
  document.addEventListener("focusin", (event) => {
    // Keyboard navigation must never land in visually hidden/revealing content.
    for (const animation of activeAnimations) {
      const element = animation.effect?.target;
      if (element?.contains(event.target) && element.matches("[data-reveal]"))
        animation.cancel();
    }
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      activeAnimations.forEach((animation) => animation.cancel());
      transition?.skipTransition();
    }
  });
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      currentPath = location.pathname;
      currentSearch = location.search;
      cancelRouteAnimations();
      applyMotionPreference();
      updateNavigation(currentPath);
      setLoading(false);
    }
  });
  // Explicitly opt out of native restoration only after enhancement is ready.
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  if (!history.state?.oaksScroll) saveScroll();
  header.classList.toggle("is-scrolled", scrollY > 20);
  applyMotionPreference();
}
