(function () {
  "use strict";

  const config = window.PEAD_SHOWREEL_VIDEO;
  const reel = window.PEAD_WORK_REEL || [];
  const videoWrap = document.getElementById("workShowcaseVideoWrap");
  const video = document.getElementById("workShowcaseVideo");
  const playBtn = document.getElementById("workVideoPlay");
  const reelTrack = document.getElementById("workReelTrack");

  if (!config || !videoWrap || !video) return;

  function initVideo() {
    video.poster = config.poster;
    videoWrap.style.setProperty("--work-video-poster", `url("${config.poster}")`);

    const startPlayback = () => {
      videoWrap.classList.add("is-playing");
      video.controls = true;
      video.muted = false;
      video.play().catch(() => {
        video.muted = true;
        video.play().catch(() => {});
      });
    };

    if (playBtn) {
      playBtn.addEventListener("click", startPlayback);
    }

    video.addEventListener("play", () => videoWrap.classList.add("is-playing"));
    video.addEventListener("pause", () => {
      if (video.currentTime === 0) videoWrap.classList.remove("is-playing");
    });

    const src = config.src;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoWrap.classList.remove("is-loading");
      });
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) videoWrap.classList.add("video-fallback");
      });
      return;
    }

    videoWrap.classList.add("video-fallback");
  }

  function renderReel() {
    if (!reelTrack || !reel.length) return;

    const doubled = reel.concat(reel);
    reelTrack.innerHTML = doubled
      .map(
        (item) => `
      <figure class="work-reel-item">
        <img src="${item.image}" alt="${item.title}" loading="lazy" />
        <figcaption>${item.title}</figcaption>
      </figure>
    `
      )
      .join("");
  }

  renderReel();
  initVideo();
})();
