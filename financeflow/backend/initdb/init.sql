-- Cria o usuário administrador inicial
INSERT INTO users (email, hashed_password, is_active, is_admin)
VALUES (
  'fadomingosf@gmail.com',
  -- senha "admin123" já criptografada em bcrypt
  '$2b$12$V8Gwx9vYqZ5V05WoDcCv0O8Vs4Yxmm7C6yyFey6ZPK8UqEFPdV5jS',
  TRUE,
  TRUE
)
ON CONFLICT (email) DO NOTHING;
