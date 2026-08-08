"use client";

import { useEffect, useState } from "react";

// <input type="datetime-local"> has no timezone of its own — its value is a
// naive "YYYY-MM-DDTHH:mm" string. Parsing that on the server with `new
// Date()` would interpret it in the *server's* timezone (UTC on Coolify),
// not the admin's, silently shifting the expiry by the offset between the
// two. Convert to/from a real UTC ISO string here, in the browser, where
// `new Date()` and the local Date getters both use the admin's own
// timezone.
function toLocalInputValue(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function ExpiryField({ defaultValueUtcIso }: { defaultValueUtcIso?: string }) {
  const [localValue, setLocalValue] = useState("");

  // Runs client-only so the conversion uses the admin's real timezone; SSR
  // renders blank first to avoid a hydration mismatch against the server's
  // timezone. There's no way to know the browser's timezone before mount,
  // so syncing this after the fact is the legitimate use of an effect here.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (defaultValueUtcIso) setLocalValue(toLocalInputValue(new Date(defaultValueUtcIso)));
  }, [defaultValueUtcIso]);

  const utcIso = localValue ? new Date(localValue).toISOString() : "";

  return (
    <>
      <input
        type="datetime-local"
        value={localValue}
        onChange={(event) => setLocalValue(event.target.value)}
        className="rounded-md border bg-background px-3 py-2"
        aria-label="Expiry date and time (your local time)"
      />
      <input type="hidden" name="expiresAt" value={utcIso} />
    </>
  );
}
