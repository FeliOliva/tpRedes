let loginForm = document.querySelector(".my-form");
async function ingresar() {
  let username = document.getElementById("username");
  let password = document.getElementById("password");
  let estado;
  const data = {
    username: username.value,
    password: password.value,
  };
  try {
    const response = await axios.post("http://localhost:3000/login", data);
    token = response.data.token;
    rol_nombre = response.data.rol_username;
    estado = response.data.estado;
    localStorage.setItem("token", token);
    localStorage.setItem("rol_nombre", rol_nombre);
    localStorage.setItem("estado", estado);
    estado = localStorage.getItem("estado");
    if (parseInt(estado) === 0) {
      location.href = "table-01/index.html";
    } else {
      alert("Usuario inhabilitado");
      location.reload();
    }
  } catch (error) {
    console.error("Error al hacer la solicitud:", error);
  }
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  await ingresar();
});
