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
    console.log("Respuesta del primer post:", response.data);
    token = response.data.token;
    rol_nombre = response.data.rol_username;
    estado = response.data.estado;
    localStorage.setItem("token", token);
    localStorage.setItem("rol_nombre", rol_nombre);
    localStorage.setItem("estado", estado);
    console.log("Token:", token);
    console.log("Rol:", localStorage.getItem("rol_nombre"));
    console.log("Estado:", localStorage.getItem("estado"));
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
// async function obtenerUsuarios() {
//   let token = localStorage.getItem("token");
//   console.log(token);
//   if (!token) {
//     console.error("No se ha encontrado el token en el almacenamiento local.");
//     return;
//   }
//   try {
//     const response = await axios.get("http://localhost:6000/registros", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error al obtener los usuarios:", error);
//     return [];
//   }
// }

// async function cargarTabla() {
//   const teamMembers = await obtenerUsuarios();

//   let tableRowCount = document.querySelector(".table-row-count");
//   tableRowCount.textContent = `(${teamMembers.length}) Members`;

//   let tableBody = document.getElementById("team-member-rows");
//   tableBody.innerHTML = ""; // Limpiar el contenido actual de la tabla

//   teamMembers.forEach((teamMember) => {
//     let row = document.createElement("tr");
//     row.innerHTML = `
//             <td>${teamMember.nombre}</td>
//             <td>${teamMember.estado === 0 ? "Activo" : "Inactivo"}</td>
//             <td>${teamMember.usuario}</td>
//             <td>${teamMember.rol_id}</td>
//         `;
//     tableBody.appendChild(row);
//   });
// }

// // Cargar la tabla cuando se cargue la página
// document.addEventListener("DOMContentLoaded", cargarTabla);
