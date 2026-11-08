import type { ReactElement } from 'react';
import { Emphasis, NoticePage } from './notice-page';

export function AccessDenied(): ReactElement {
  return (
    <NoticePage
      title={
        <>
          Acceso <Emphasis>denegado</Emphasis>
        </>
      }
      message='Esta sección es privada.'
    />
  );
}
