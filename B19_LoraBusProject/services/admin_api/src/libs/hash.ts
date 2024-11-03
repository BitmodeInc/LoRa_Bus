import bcrypt from 'bcrypt';

// ฟังก์ชันสำหรับแฮชรหัสผ่าน
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

// ฟังก์ชันสำหรับเปรียบเทียบรหัสผ่าน
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}
