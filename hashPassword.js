import bcrypt from 'bcryptjs';

const email = 'faty@example.com';
const password = 'grupo19';
const salt = bcrypt.genSaltSync(10);
const hashedPassword = bcrypt.hashSync(password, salt);

console.log(`Correo: ${email}`);
console.log(`Contraseña hasheada: ${hashedPassword}`);
