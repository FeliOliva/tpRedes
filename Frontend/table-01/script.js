document.addEventListener("DOMContentLoaded", async () => {
  await cargarTabla();
});

async function obtenerUsuarios() {
  let token = localStorage.getItem("token");
  if (!token) {
    console.error("No se ha encontrado el token en el almacenamiento local.");
    return [];
  }
  try {
    const response = await axios.get("http://localhost:3000/registros", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.registros;
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    return [];
  }
}
async function cargarTabla() {
  const teamMembers = await obtenerUsuarios();
  let tableRowCount = document.getElementsByClassName("table-row-count");
  tableRowCount[0].innerHTML = `(${teamMembers.length}) Members`;
  let tableBody = document.getElementById("team-member-rows");

  const mappedRecords = teamMembers.map((teamMember) => {
    const rolNombre = teamMember.rol_nombre;
    const userIdAndRol = `${teamMember.id}_${rolNombre}`;
    return `<tr data-user-id="${userIdAndRol}"> <!-- Agregar atributo data-user-id con ID y rol -->
                          <td>
                              <span class="profile-info__name">
                                  ${teamMember.nombre}
                              </span>
                          </td>
                          <td>
                              <span class="profile-info__name">
                                  ${teamMember.apellido || ""} 
                              </span>
                          </td>
                          <td>${teamMember.usuario || ""}</td>
                          <td>
                              <span class="tag tag--${rolNombre}">
                                  ${rolNombre}
                              </span>        
                          </td>
                          <td>
                              <span class="status status--${
                                teamMember.estado === 0 ? "active" : "inactive"
                              }">
                                  ${
                                    teamMember.estado === 0
                                      ? "Activo"
                                      : "Inactivo"
                                  }
                              </span>
                          </td>
                          <td class="acciones"> <!-- Nueva columna para acciones -->
                              <button class="btn-habilitar">Habilitar</button>
                              <button class="btn-deshabilitar">Deshabilitar</button>
                          </td>
                      </tr>`;
  });
  tableBody.innerHTML = mappedRecords.join("");
  agregarEventosAcciones();
}

async function agregarEventosAcciones() {
  document.querySelectorAll(".btn-habilitar").forEach((btnHabilitar) => {
    btnHabilitar.addEventListener("click", async function () {
      const { userId, rol } = obtenerUsuarioIdYRol(this);
      if (!userId) return;
      try {
        const response = await habilitarUsuarios(userId);
      } catch (error) {
        console.error("Error al habilitar usuario:", error);
      }
    });
  });

  document.querySelectorAll(".btn-deshabilitar").forEach((btnDeshabilitar) => {
    btnDeshabilitar.addEventListener("click", async function () {
      const { userId, rol } = obtenerUsuarioIdYRol(this);
      if (!userId) return;
      try {
        const response = await deshabilitarUsuarios(userId, rol);
      } catch (error) {
        console.error("Error al deshabilitar usuario:", error);
      }
    });
  });
}
async function habilitarUsuarios(usuarioId, rolUsuario) {
  let token = localStorage.getItem("token");
  let rol = localStorage.getItem("rol_nombre");
  let estado = 0;

  if (!token) {
    throw new Error("No se ha encontrado el token en el almacenamiento local.");
  } else if (rol !== "admin" && rol !== "master") {
    alert("No tienes permisos para habilitar usuarios");
    return;
  } else if (rolUsuario === "master") {
    alert("No puedes habilitar otro master");
    return;
  }
  try {
    const response = await axios.put(
      `http://localhost:3000/habilitar/${usuarioId}`,
      { estado },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    location.reload();
    return response.data;
  } catch (error) {
    throw new Error("Error al habilitar usuario:", error);
  }
}

async function deshabilitarUsuarios(usuarioId, rolUsuario) {
  let token = localStorage.getItem("token");
  let rol = localStorage.getItem("rol_nombre");
  let estado = 1;
  if (!token) {
    throw new Error("No se ha encontrado el token en el almacenamiento local.");
  } else if (rol !== "admin" && rol !== "master") {
    alert("No tienes permisos para deshabilitar usuarios");
    return;
  } else if (rolUsuario === "master") {
    alert("No puedes deshabilitar otro master");
    return;
  }

  try {
    const response = await axios.put(
      `http://localhost:3000/deshabilitar/${usuarioId}`,
      { estado }, // Pasar el estado en el cuerpo de la solicitud
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    location.reload();
    return response.data;
  } catch (error) {
    throw new Error("Error al deshabilitar usuario:", error);
  }
}
function obtenerUsuarioIdYRol(elemento) {
  const filaUsuario = elemento.closest("tr");
  if (!filaUsuario) {
    console.error("No se pudo encontrar la fila del usuario.");
    return null;
  }
  const userIdAndRol = filaUsuario.dataset.userId;
  if (!userIdAndRol) {
    console.error("No se pudo encontrar el ID y rol del usuario.");
    return null;
  }
  const [userId, rol] = userIdAndRol.split("_");
  return { userId, rol };
}
function abrirModalCrearUsuario() {
  const modal = document.getElementById("modal-crear-usuario");
  const rolActual = localStorage.getItem("rol_nombre");

  if (rolActual !== "admin" && rolActual !== "master") {
    alert("No tienes permisos para crear usuarios");
    return;
  }

  modal.style.display = "block";
}

function cerrarModalCrearUsuario() {
  const modal = document.getElementById("modal-crear-usuario");
  modal.style.display = "none";
}

async function crearUsuario() {
  const nombre = document.getElementById("nombre").value;
  const apellido = document.getElementById("apellido").value;
  const usuario = document.getElementById("usuario").value;
  const password = document.getElementById("password").value;
  const rol = document.getElementById("rol").value;
  const estado = 0;

  try {
    const token = localStorage.getItem("token");
    const rolActual = localStorage.getItem("rol_nombre");

    if (!token) {
      throw new Error(
        "No se ha encontrado el token en el almacenamiento local."
      );
    }

    if (rolActual !== "admin" && rolActual !== "master") {
      throw new Error("No tienes permisos para crear usuarios");
    }

    const response = await axios.post(
      "http://localhost:3000/crearUsuario",
      {
        nombre: nombre,
        apellido: apellido,
        usuario: usuario,
        password: password,
        rol_id: rol,
        estado: estado,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    await cargarTabla();
    cerrarModalCrearUsuario();
  } catch (error) {
    console.error("Error al crear usuario:", error);
    alert(error.message);
  }
}
async function mostrarImg() {
  const rolActual = localStorage.getItem("rol_nombre");
  if (rolActual !== "admin" && rolActual !== "master") {
    alert("No tienes permisos para ver imagenes");
    return;
  } else {
    location.href = "../zorro.html";
  }
}
