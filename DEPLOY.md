# Despliegue — Procesos Operativos Bailmex

## 1) Backend de comentarios (Apps Script + Sheets)

1. Abre tu Sheet: https://docs.google.com/spreadsheets/d/10Mzy6WKOh4jeMhIxN7-nbf1ozP-liiIHx8dOK9Mn0jQ/edit
2. Menú **Extensiones → Apps Script**. Se abre el editor.
3. Borra el contenido del archivo `Code.gs` y pega el contenido de `apps-script-code.gs` (en esta carpeta).
4. Dale nombre al proyecto (ej. `Bailmex Comentarios`) y guarda (Ctrl+S).
5. Click en **Desplegar → Nueva implementación**.
   - Tipo: **Aplicación web**
   - Ejecutar como: **Yo (jorgemorales@bailmex.com.mx)**
   - Quién tiene acceso: **Cualquier usuario** (necesario para que el HTML pueda llamarlo sin login)
   - Click **Implementar**.
6. Autoriza los permisos la primera vez (acceso a Sheets). Si ves "Google no ha verificado la app", click **Configuración avanzada → Ir a (nombre)**.
7. Copia la **URL de la aplicación web** (termina en `/exec`). La necesitarás en el paso 2.

Al primer `POST` el script crea automáticamente la pestaña `Comentarios` con columnas `Fecha | Diagrama | Nombre | Comentario`.

> **Nota:** si editas el código más tarde, debes **Desplegar → Administrar implementaciones → editar → Nueva versión** para que los cambios se publiquen. La URL se mantiene.

## 2) Configurar el HTML

Edita `procesos-bailmax.html` y reemplaza dos valores al inicio del `<script>`:

```js
const ACCESS_PASSWORD = 'bailmex2026';           // cámbialo por tu contraseña real
const APPS_SCRIPT_URL = 'PEGA_AQUI_LA_URL_DEL_APPS_SCRIPT';  // pega la URL del paso 1.7
```

**Importante sobre la contraseña**: está en texto plano en el HTML, visible con "ver código fuente". Sirve como disuasor, no como seguridad real. Para seguridad real usa Cloudflare Access (gratis hasta 50 usuarios).

Abre el archivo en tu navegador para probar localmente antes de publicar:
- Debe pedirte la contraseña
- Al enviar un comentario debe aparecer una fila nueva en el Sheet

## 3) Publicar en GitHub Pages

### 3.1 Crear el repo (web)
1. Entra a https://github.com/new
2. Nombre: `procesos-bailmex` (o lo que prefieras)
3. **Privado o público**: cualquiera funciona. Pages publica la URL aunque el repo sea privado (en GitHub Pro/Team; en plan gratuito Pages requiere repo público).
4. **NO** marques "Add README" ni `.gitignore` (ya los tenemos).
5. Crea el repo. Copia la URL HTTPS que te muestra (ej. `https://github.com/jorge/procesos-bailmex.git`).

### 3.2 Inicializar git y subir (desde esta carpeta)

```bash
cd "c:/Users/x/Desktop/Diagrama Procesos Operativos"
git init -b main
git add .gitignore procesos-bailmax.html apps-script-code.gs DEPLOY.md
# Verifica que service-account-key.json NO aparece en la lista:
git status
git commit -m "Inicial: diagramas + comentarios + gate"
git remote add origin https://github.com/TU_USUARIO/procesos-bailmex.git
git push -u origin main
```

Si `git push` te pide credenciales, usa un [Personal Access Token](https://github.com/settings/tokens) como contraseña (GitHub ya no acepta passwords normales).

### 3.3 Activar Pages
1. En el repo, **Settings → Pages**.
2. Source: **Deploy from a branch**
3. Branch: **main**, carpeta **/ (root)**. Save.
4. En 1–2 minutos te da la URL: `https://TU_USUARIO.github.io/procesos-bailmex/procesos-bailmax.html`

Considera renombrar el archivo a `index.html` antes del push para que la URL quede limpia (`.../procesos-bailmex/`).

## 4) Seguridad — checklist crítico

- [ ] `service-account-key.json` **NO** está en el commit (revisa con `git ls-files`).
- [ ] Si alguna vez lo llegaste a pushear, **rota la llave** en GCP Console → IAM → Cuentas de servicio.
- [ ] Cambia `ACCESS_PASSWORD` antes de compartir el link.
- [ ] El Sheet debe estar compartido solo con quien tú quieras (el Apps Script lo lee como tú, no hace falta compartirlo con nadie más).

## 5) Mantenimiento

- **Cambiar contraseña**: edita `ACCESS_PASSWORD` en el HTML, commit + push. GitHub Pages actualiza en ~30 segundos.
- **Ver comentarios**: directamente en el Sheet, pestaña `Comentarios`.
- **Borrar un comentario**: borra la fila en el Sheet.
- **Cambiar Sheet**: edita `SHEET_ID` en `apps-script-code.gs` y redepliega (Administrar implementaciones → Nueva versión).
