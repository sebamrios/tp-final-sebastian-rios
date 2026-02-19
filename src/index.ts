import express, { Request, Response } from 'express';
import path from 'path';
import 'dotenv/config';
import usersRouter from './routes/users.routes';
import mascotasRouter from './routes/mascotas.routes';
import historialRouter from './routes/historial.routes';
import viewsRouter from './routes/views.routes';
//import { authenticate, authorize } from "./middlewares/auth.middleware";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`[REQUEST] ${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Serve static files from public directory
const publicPath = path.join(process.cwd(), 'public');
app.use(express.static(publicPath));
console.log(`[SERVER] Archivos estáticos servidos desde: ${publicPath}`);

// Rutas PÚBLICAS
//app.use("/api/auth", authRouter); // Registro y login

// Rutas PROTEGIDAS
//app.use("/api/users", authenticate, authorize(["admin"]), userRouter); // CRUD de usuarios
//app.use("/api/pets", authenticate, authorize(["vet"]), petRouter); // CRUD de mascotas
//app.use("/api/clinic", authenticate, authorize(["vet"]), clinicRouter); // CRUD de consultas

app.use('/api/users', usersRouter);
app.use('/api/mascotas', mascotasRouter);
app.use('/api/historial', historialRouter);
app.use('/handlebars', viewsRouter);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`--- Configuración Exitosa ---`);
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
}); 