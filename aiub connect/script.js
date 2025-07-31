const dayMap = {
  Sun: "Sunday",
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday"
};

document.getElementById('imageInput').addEventListener('change', async function () {
  const file = this.files[0];
  if (!file) return;

  document.getElementById("status").innerText = "🕒 Processing image...";

  const { data: { text } } = await Tesseract.recognize(file, 'eng');
  const lines = text.split('\n').map(line => line.replace(/^‘/g, '').trim()).filter(l => l);

  const courseRegex = /^(.*?)\s+\[(.)\]$/;
  const timeRegex = /Time: (\w+)\s([\d:]+(?:\s?[AP]M)?) - \w+\s([\d:]+(?:\s?[AP]M)?) Room: (\w+)/;

  const tableBody = document.querySelector("#resultTable tbody");
  tableBody.innerHTML = "";
  let i = 0;

  while (i < lines.length) {
    const courseMatch = lines[i].match(courseRegex);
    if (courseMatch && i + 1 < lines.length) {
      const title = courseMatch[1].trim(); // Only course name
      const section = courseMatch[2].trim();

      const timeMatch = lines[i + 1].match(timeRegex);
      if (timeMatch) {
        const day = dayMap[timeMatch[1]] || timeMatch[1];
        const startTime = timeMatch[2];
        const meridian = startTime.toUpperCase().includes("PM") ? "PM" : "AM";
        const room = timeMatch[4].trim(); // Only room number

        const row = `<tr>
          <td>${title}</td>
          <td>${section}</td>
          <td>${day}</td>
          <td>${meridian}</td>
          <td>${room}</td>
        </tr>`;
        tableBody.innerHTML += row;
      }
      i += 2;
    } else {
      i++;
    }
  }

  document.getElementById("resultTable").style.display = "table";
  document.getElementById("status").innerText = "Done!";
});
