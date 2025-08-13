// ==== CONFIG ====
const OPENAI_API_KEY = "AIzaSyDA8aGpo2YCNh-cur7mv62TobFK7hsgZ50"; // Replace with your key

// ==== TASK 1: Access camera & click photo ====
function task1() {
    const output = document.getElementById("outputBox");
    output.innerHTML = `<video id="cam1" autoplay></video><br><button id="capture">📸 Capture Photo</button><canvas id="photo"></canvas>`;

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            document.getElementById("cam1").srcObject = stream;
        });

    document.getElementById("capture").onclick = () => {
        let video = document.getElementById("cam1");
        let canvas = document.getElementById("photo");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d").drawImage(video, 0, 0);
    };
}

// ==== TASK 2: Live stream camera ====
function task2() {
    const output = document.getElementById("outputBox");
    output.innerHTML = `<video id="cam2" autoplay></video>`;
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            document.getElementById("cam2").srcObject = stream;
        });
}

// ==== TASK 3: Record video ====
function task3() {
    const output = document.getElementById("outputBox");
    output.innerHTML = `<video id="preview" autoplay></video><br>
        <button id="startRec">Start</button> <button id="stopRec">Stop & Download</button>`;

    let mediaRecorder, chunks = [];
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            document.getElementById("preview").srcObject = stream;
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = e => chunks.push(e.data);
            mediaRecorder.onstop = () => {
                let blob = new Blob(chunks, { type: "video/mp4" });
                let link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = "recording.mp4";
                link.click();
            };
        });

    document.getElementById("startRec").onclick = () => mediaRecorder.start();
    document.getElementById("stopRec").onclick = () => mediaRecorder.stop();
}

// ==== TASK 4: Search Google & get links ====
function task4() {
    const name = prompt("Enter name to search:");
    window.open(`https://www.google.com/search?q=${encodeURIComponent(name)}`, "_blank");
}

// ==== TASK 5: Google App Script Practice ====
function task5() {
    document.getElementById("outputBox").innerHTML = "Here you can paste your Google App Script output.";
}

// ==== TASK 6: Drag & Drop Div ====
function task6() {
    const output = document.getElementById("outputBox");
    output.innerHTML = `<div id="dragDiv" style="width:100px;height:100px;background:red;position:absolute;cursor:move;"></div>`;
    const dragDiv = document.getElementById("dragDiv");
    dragDiv.onmousedown = function (e) {
        let shiftX = e.clientX - dragDiv.getBoundingClientRect().left;
        let shiftY = e.clientY - dragDiv.getBoundingClientRect().top;
        function moveAt(pageX, pageY) {
            dragDiv.style.left = pageX - shiftX + 'px';
            dragDiv.style.top = pageY - shiftY + 'px';
        }
        function onMouseMove(e) {
            moveAt(e.pageX, e.pageY);
        }
        document.addEventListener('mousemove', onMouseMove);
        dragDiv.onmouseup = function () {
            document.removeEventListener('mousemove', onMouseMove);
            dragDiv.onmouseup = null;
        };
    };
    dragDiv.ondragstart = () => false;
}

// ==== TASK 7: Connect JS with ChatGPT ====
// Improved Task 7 - ChatGPT with verbose error handling
async function task7() {
  const prompt = window.prompt("Enter your prompt for ChatGPT:");
  if(!prompt) return;
  const output = document.getElementById("outputBox");
  output.innerHTML = "⏳ Calling OpenAI... (check console/network for details)";

  const key = OPENAI_API_KEY; // or load from localStorage if you put it there
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 600
      })
    });

    const text = await res.text();               // read raw text for debugging
    console.log("OpenAI response status:", res.status, res.statusText);
    console.log("OpenAI raw response:", text);

    if (!res.ok) {
      output.innerHTML = `<div style="color:#ffb3b3">OpenAI error ${res.status}: ${escapeHtml(text)}</div>`;
      return;
    }

    // parse JSON only after checking ok
    const data = JSON.parse(text);
    const reply = data.choices?.[0]?.message?.content || JSON.stringify(data);
    output.innerHTML = `<div style="white-space:pre-wrap">${escapeHtml(reply)}</div>`;

  } catch (err) {
    console.error("Fetch failed:", err);
    output.innerHTML = `<div style="color:#ffb3b3">Request failed: ${escapeHtml(err.message)}</div>`;
  }
}
