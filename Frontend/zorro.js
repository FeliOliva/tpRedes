document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch("http://localhost:3000/zorros", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    const imageUrl = data.image;
    const foxImage = document.getElementById("fox_img");
    const foxLink = document.getElementById("fox_full_link");

    foxImage.src = imageUrl;
    foxLink.href = "https://randomfox.ca/?i=" + data.randomNumber;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});
