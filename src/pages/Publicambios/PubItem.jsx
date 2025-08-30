// PubItem.jsx
import { PubHeader } from "./PubHeader";
import { PubDetalles } from "./PubDetalles";
import { Divider } from "@mui/material";

export function PubItem({
  pub,
  esPropia,
  expandedPubId,
  variant,
  onToggleExpand,
  onClick,
  onBorrarPublicacion,
  onToggleAsignado,
}) {
  const expanded = expandedPubId === pub?.id;

  return (
    <div key={pub.creado}>
      <PubHeader
        pub={pub}
        esPropia={esPropia}
        onClick={onToggleExpand || onClick}
        onBorrarPublicacion={onBorrarPublicacion}
        variant={variant}
      />

      {expanded && (
        <>
          <Divider />
          <PubDetalles
            pub={pub}            
            onToggleAsignado={onToggleAsignado}
          />
        </>
      )}
    </div>
  );
}