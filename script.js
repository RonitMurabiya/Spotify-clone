console.log("lets start js");
let currentSong = new Audio();
let songs;
let currFolder;

function convertSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = Math.floor(seconds % 60);
  return (
    minutes.toString().padStart(2, "0") +
    ":" +
    remainingSeconds.toString().padStart(2, "0")
  );
}

async function getSongs(folder) {
  currFolder = folder;
  let x = await fetch(`/${folder}/`);
  let response = await x.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let a = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < a.length; index++) {
    const element = a[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

  let songUl = document
    .querySelector(".library-box")
    .getElementsByTagName("ol")[0];
  songUl.innerHTML = "";
  for (const song of songs) {
    songUl.innerHTML =
      songUl.innerHTML +
      `<li><img class="invert" width="34" src="svg/music.svg" alt="">
    <div class="info">
    <div> ${song.replaceAll("%20", " ")}</div>
    </div>
    <div class="playnow">
    <img class="invert" src="svg/play.svg" alt="">
    </div> </li>`;
  }
  // Attach an event listener to each song
  Array.from(
    document.querySelector(".library-box").getElementsByTagName("li")
  ).forEach((ele) => {
    ele.addEventListener("click", (element) => {
      console.log(ele.querySelector(".info").firstElementChild.innerHTML);
      playMusic(ele.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
  return songs;
}

const playMusic = (track, pause = false) => {
  currentSong.src = `/${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" color="#ffffff" fill="none"><path d="M4 7C4 5.58579 4 4.87868 4.43934 4.43934C4.87868 4 5.58579 4 7 4C8.41421 4 9.12132 4 9.56066 4.43934C10 4.87868 10 5.58579 10 7V17C10 18.4142 10 19.1213 9.56066 19.5607C9.12132 20 8.41421 20 7 20C5.58579 20 4.87868 20 4.43934 19.5607C4 19.1213 4 18.4142 4 17V7Z" stroke="currentColor" stroke-width="1.5" /><path d="M14 7C14 5.58579 14 4.87868 14.4393 4.43934C14.8787 4 15.5858 4 17 4C18.4142 4 19.1213 4 19.5607 4.43934C20 4.87868 20 5.58579 20 7V17C20 18.4142 20 19.1213 19.5607 19.5607C19.1213 20 18.4142 20 17 20C15.5858 20 14.8787 20 14.4393 19.5607C14 19.1213 14 18.4142 14 17V7Z" stroke="currentColor" stroke-width="1.5" />';
  }
  document.querySelector(".play-text").innerHTML = track;
  document.querySelector(".play-time").innerHTML = "00/00 : 00/00";
};

async function albums() {
  console.log("displaying albums");
  let a = await fetch(`/music/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".playlist-box");
  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if (e.href.includes("/music/") && !e.href.includes(".htaccess")) {
      console.log(e.href.split("music/").slice(-2)[1]);
      let folder = e.href.split("music/").slice(-2)[1];
      let a = await fetch(`/music/${folder}/info.json`);
      let response = await a.json();
      console.log(response);
      cardContainer.innerHTML =
        cardContainer.innerHTML +
        ` <div data-folder="${folder}" class="card">
      <button class="play-button ">
      <svg width="25" height="25" viewBox="0 0 24 24" fill="#000"
      xmlns="http://www.w3.org/2000/svg">
      <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
          stroke-linejoin="round" />
        </svg>
        </button>
      <div class="image">
          <img src="/music/${folder}/cover.jpg" alt="Playlist ">
      </div>
      <h3>${response.title}</h3>
      <p>${response.description}</p>
  </div>`;
    }
  }
}

async function main() {
  await getSongs("trend/ncs");
  playMusic(songs[0], true);

  await albums();

  // Attach an event listener to play, next and previous
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      console.log(play.src);
      play.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" color="#ffffff" fill="none"><path d="M4 7C4 5.58579 4 4.87868 4.43934 4.43934C4.87868 4 5.58579 4 7 4C8.41421 4 9.12132 4 9.56066 4.43934C10 4.87868 10 5.58579 10 7V17C10 18.4142 10 19.1213 9.56066 19.5607C9.12132 20 8.41421 20 7 20C5.58579 20 4.87868 20 4.43934 19.5607C4 19.1213 4 18.4142 4 17V7Z" stroke="currentColor" stroke-width="1.5" /><path d="M14 7C14 5.58579 14 4.87868 14.4393 4.43934C14.8787 4 15.5858 4 17 4C18.4142 4 19.1213 4 19.5607 4.43934C20 4.87868 20 5.58579 20 7V17C20 18.4142 20 19.1213 19.5607 19.5607C19.1213 20 18.4142 20 17 20C15.5858 20 14.8787 20 14.4393 19.5607C14 19.1213 14 18.4142 14 17V7Z" stroke="currentColor" stroke-width="1.5" />';
    } else {
      currentSong.pause();
      play.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" color="#ffffff" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" /><path d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z" fill="#ffffff" />';
    }
  });

  // Listen for timeupdate event
  currentSong.addEventListener("timeupdate", () => {
    // console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".play-time").innerHTML = `${convertSeconds(
      currentSong.currentTime
    )}/${convertSeconds(currentSong.duration)}`;
    document.querySelector("#circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  // for loop song
  currentSong.addEventListener("ended", () => {
    currentSong.currentTime = 0;
    currentSong.play();
  });

  // Add an event listener to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let change = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector("#circle").style.left - change + "%";
    currentSong.currentTime = (currentSong.duration * change) / 100;
  });

  // Add an event listener for ham
  document.querySelector(".ham").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  // Add an event listener for close button
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-130%";
  });

  // Add an event listener to previous button
  previous.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });

  // Add an event listener to next
  next.addEventListener("click", () => {
    // currentSong.pause();
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  // Add an event to volume
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      currentSong.volume = parseInt(e.target.value) / 100;
    });

  // Add event listener to mute the track
  document.querySelector(".volumn>img").addEventListener("click", (e) => {
    console.log(e.target);
    console.log("change", e.target.src);
    if (e.target.src.includes("svg/volumn.svg")) {
      e.target.src = e.target.src.replace("svg/volumn.svg", "svg/mute.svg");
      currentSong.volume = 0;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 0;
    } else {
      e.target.src = e.target.src.replace("svg/mute.svg", "svg/volumn.svg");
      currentSong.volume = 0.1;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 10;
    }
  });

  Array.from(document.getElementsByClassName("card")).forEach((ele) =>
    ele.addEventListener("click", async (item) => {
      console.log("Fetching Songs");
      songs = await getSongs(`music/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0]);
      // document.querySelector(".trend").style.color = "#121212";
      document.querySelector(".trend").style.display = "none";
    })
  );
}
main();
