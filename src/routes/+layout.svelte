<script lang="ts">
  import { onNavigate } from "$app/navigation";
  import Navbar from "$lib/components/Navbar.svelte";
  import { ModeWatcher, mode } from "mode-watcher";
  import "../app.css";
  import { onMount } from "svelte";
  import { Toaster } from "$lib/components/ui/sonner/index";
  import { toast } from "svelte-sonner";

  // props
  let { children } = $props();

  // view transition API
  onNavigate((navigation) => {
    if (!document.startViewTransition) return;

    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });

  // service worker updates
  async function detectSWUpdate() {
    const registration = await navigator.serviceWorker.ready;

    registration.addEventListener("updatefound", () => {
      const newSW = registration.installing;
      newSW?.addEventListener("statechange", () => {
        if (newSW.state === "installed") {
          toast("Back online.", {
            action: {
              label: "Reload",
              onClick: () => {
                newSW.postMessage({ type: "SKIP_WAITING" });
                window.location.reload();
              },
            },
          });
        }
      });
    });
  }

  onMount(() => {
    detectSWUpdate();
  });
</script>

<svelte:head>
  <meta name="theme-color" content={$mode === "dark" ? "#0a0a0a" : "#ffffff"} />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1, maximum-scale=1"
  />
</svelte:head>

<ModeWatcher />
<Toaster />
<Navbar />
{@render children()}

<style>
  @keyframes fade-in {
    from {
      opacity: 0;
    }
  }

  @keyframes fade-out {
    to {
      opacity: 0;
    }
  }

  :root::view-transition-old(root) {
    animation: 150ms cubic-bezier(0.4, 0, 1, 1) both fade-out;
  }

  :root::view-transition-new(root) {
    animation: 150ms cubic-bezier(0, 0, 0.2, 1) 150ms both fade-in;
  }
</style>
