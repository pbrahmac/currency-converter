<script lang="ts">
  import { Button } from "$lib/components/ui/button/index";
  import * as Card from "$lib/components/ui/card/index";
  import { Input } from "$lib/components/ui/input/index";
  import { Label } from "$lib/components/ui/label/index";
  import { Separator } from "$lib/components/ui/separator/index";
  import { Skeleton } from "$lib/components/ui/skeleton/index";
  import {
    fetchConversionData,
    formatConversion,
    isZeroValue,
    type Country,
  } from "$lib/utils";
  import Swap from "lucide-svelte/icons/arrow-left-right";
  import Coins from "lucide-svelte/icons/coins";
  import { onMount } from "svelte";
  import CountryPicker from "./CountryPicker.svelte";

  // types
  type ConvertObj = {
    from: {
      currency: Country;
      amount: string;
      conversionRate: number;
    };
    to: {
      currency: Country;
      amount: string;
      conversionRate: number;
    };
  };

  let loading = $state(true);
  $inspect(loading);

  let convert: ConvertObj = $state({
    from: {
      currency: "USD",
      amount: "0",
      conversionRate: 3,
    },
    to: {
      currency: "THB",
      amount: "0",
      conversionRate: 1 / 3,
    },
  });

  function convertFromFirstToSecond(value: string) {
    if (isZeroValue(value)) {
      convert.from.amount = value[1];
    } else {
      convert.from.amount = value;
    }

    const original = parseFloat(value);
    const converted = original * convert.from.conversionRate;
    convert.to.amount = formatConversion(converted);

    if (!value) {
      [convert.from.amount, convert.to.amount] = ["0", "0"];
    }
  }

  function convertFromSecondToFirst(value: string) {
    if (isZeroValue(value)) {
      convert.to.amount = value[1];
    } else {
      convert.to.amount = value;
    }

    const original = parseFloat(value);
    const converted = original * convert.to.conversionRate;
    convert.from.amount = formatConversion(converted);

    if (!value) {
      [convert.from.amount, convert.to.amount] = ["0", "0"];
    }
  }

  function handleSwap() {
    [convert.from, convert.to] = [convert.to, convert.from];
  }

  onMount(async () => {
    // fetch conversion data from API and populate object with actual rates
    const rates = await fetchConversionData(convert.from.currency);
    const firstToSecondRate = rates[convert.to.currency.toLowerCase()];
    convert.from.conversionRate = firstToSecondRate.rate;
    convert.to.conversionRate = firstToSecondRate.inverseRate;

    // set loading state to false
    loading = false;
  });
</script>

<Card.Root class="md:w-[400px] w-full">
  <Card.Header>
    <div class="flex justify-between w-full">
      <div class="flex flex-col space-y-1 justify-center w-auto">
        <Card.Title>Currency Converter</Card.Title>
        <Card.Description class="text-xs">
          Convert {convert.from.currency} to {convert.to.currency}
        </Card.Description>
      </div>
      <Button variant="ghost" size="icon" onclick={handleSwap}>
        <Swap class="size-10" />
      </Button>
    </div>
  </Card.Header>
  <Card.Content class="flex items-center justify-center w-full space-x-4">
    <div class="flex flex-col justify-center space-y-2">
      <Label for="convertFrom">
        <CountryPicker currCode={convert.from.currency} direction="from" />
      </Label>
      <Input
        bind:value={convert.from.amount}
        name="convertFrom"
        type="number"
        pattern="[0-9]+"
        oninput={(e) => convertFromFirstToSecond(e.currentTarget.value)}
      />
    </div>
    <div class="flex flex-col justify-center space-y-2">
      <Label for="convertTo">
        <CountryPicker currCode={convert.to.currency} direction="to" />
      </Label>
      <Input
        bind:value={convert.to.amount}
        name="convertTo"
        type="number"
        pattern="[0-9]+"
        oninput={(e) => convertFromSecondToFirst(e.currentTarget.value)}
      />
    </div>
  </Card.Content>
  <Card.Footer class="flex flex-col space-y-2">
    <Button
      class="w-full"
      onclick={() => ([convert.from.amount, convert.to.amount] = ["0", "0"])}
      >Clear</Button
    >
    <Separator />
    <div
      class="w-full border flex items-center justify-start space-x-4 px-3 py-2 rounded-md"
    >
      <Coins class="size-6 mx-2" />
      <div class="flex flex-col justify-center w-full">
        {#if loading}
          <Skeleton class="w-3/4 h-4 mb-1" />
          <Skeleton class="w-full h-3" />
        {:else}
          <p class="text-sm">
            1 {convert.from.currency} = {convert.from.conversionRate.toFixed(4)}
            {convert.to.currency}
          </p>
          <p class="text-xs text-muted-foreground">
            Updated 11/19/2024, 2:59:12 AM
          </p>
        {/if}
      </div>
    </div>
  </Card.Footer>
</Card.Root>
