export const PRIVACY_SECTIONS: ReadonlyArray<{ title: string; body: ReadonlyArray<string> }> = [
  {
    title: 'Quién es el responsable',
    body: ['Lisandro López, Licenciado en Nutrición. [Completar: nombre completo y domicilio del responsable]'],
  },
  {
    title: 'Qué datos pedimos',
    body: [
      'Tu nombre, tu email, tu teléfono y, cuando reservás un turno, tu obra social si querés indicarla.',
      'Nunca pedimos ni guardamos tu historia clínica en esta web.',
    ],
  },
  {
    title: 'Para qué los usamos',
    body: ['Para gestionar tu cuenta y tus turnos, y para avisarte por email o por WhatsApp sobre ellos.'],
  },
  {
    title: 'En qué nos basamos',
    body: ['En tu consentimiento, que nos das al crear tu cuenta o al reservar un turno.'],
  },
  {
    title: 'Cuánto tiempo los guardamos',
    body: ['[Completar: plazo de guarda]'],
  },
  {
    title: 'Quién los ve',
    body: [
      'Sólo Lisandro. Para que la web funcione usamos dos proveedores: uno que guarda la base de datos y otro que envía los emails.',
    ],
  },
  {
    title: 'Tus derechos',
    body: [
      'Podés pedir acceso a tus datos, corregirlos o que los eliminemos. Si tenés cuenta, podés usar «Eliminar mi cuenta» en Mi espacio; si no, escribinos a [Completar: email de contacto].',
      'La Agencia de Acceso a la Información Pública (AAIP) es el órgano de control de la Ley 25.326 y atiende las denuncias y reclamos por incumplimientos.',
    ],
  },
];
