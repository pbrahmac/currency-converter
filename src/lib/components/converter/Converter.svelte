<script lang="ts">
  import { Button } from "$lib/components/ui/button/index";
  import * as Card from "$lib/components/ui/card/index";
  import { Input } from "$lib/components/ui/input/index";
  import { Label } from "$lib/components/ui/label/index";
  import { Separator } from "$lib/components/ui/separator/index";
  import { Switch } from "$lib/components/ui/switch/index";
  import { Skeleton } from "$lib/components/ui/skeleton/index";
  import {
    fetchConversionData,
    formatConversion,
    formatRate,
    isZeroValue,
    loadFromLocalStorage,
    type ConvertObj,
    type CurrencyRateData,
  } from "$lib/utils";
  import Swap from "lucide-svelte/icons/arrow-left-right";
  import Coins from "lucide-svelte/icons/coins";
  import { onMount } from "svelte";
  import CountryPicker from "./CountryPicker.svelte";

  // loading state for data fetching
  let loading = $state(true);
  let offline = $state(false);
  let customRateEnabled = $state(false);
  let originalConversionRate = $state(1);

  // object to hold conversion data
  let convert: ConvertObj = $state({
    from: {
      currency: "USD",
      fullName: "U.S. Dollar",
      amount: "0",
      conversionRate: 3,
      refreshDate: null,
    },
    to: {
      currency: "THB",
      fullName: "Thai Baht",
      amount: "0",
      conversionRate: 1 / 3,
      refreshDate: null,
    },
  });

  // functions to handle conversion (on input change)
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

  /*
   * lifecycle hooks and effects to fetch new data from API when needed
   * and update conversion data object accordingly
   */
  let rates: Record<string, CurrencyRateData> = $state({});
  // will run when `convert.from.currency` is updated
  $effect(() => {
    loading = true;
    fetchConversionData(convert.from.currency).then(
      (refreshedRates) => {
        rates = refreshedRates;
        const firstToSecondRate = rates[convert.to.currency.toLowerCase()];
        convert.from.conversionRate = firstToSecondRate.rate;
        convert.to.conversionRate = firstToSecondRate.inverseRate;
        originalConversionRate = firstToSecondRate.rate;
        convert.from.refreshDate = new Date(firstToSecondRate.date);
        convert.to.fullName = firstToSecondRate.name;
        loading = false;
      },
      () => {
        offline = true;
        convert.from.conversionRate = 1;
        convert.to.conversionRate = 1;
        convert.to.fullName = convert.to.currency;
        loading = false;
      }
    );
  });
  // will run when `convert.to.currency` is updated, this is so we reduce the number of calls to the API
  $effect(() => {
    convert.to.currency;
    return () => {
      const firstToSecondRate = rates[convert.to.currency.toLowerCase()];
      convert.from.conversionRate = firstToSecondRate && firstToSecondRate.rate;
      convert.to.conversionRate =
        firstToSecondRate && firstToSecondRate.inverseRate;
      originalConversionRate = firstToSecondRate && firstToSecondRate.rate;
      convert.to.fullName = firstToSecondRate && firstToSecondRate.name;
    };
  });
  $effect(() => {
    convert.from.conversionRate;
    return () => {
      convert.to.amount = (
        parseFloat(convert.from.amount) * convert.from.conversionRate
      ).toString();
    };
  });
  // load from localStorage on component mount
  onMount(() => {
    [convert.from.currency, convert.to.currency] = loadFromLocalStorage(
      convert.from.currency,
      convert.to.currency
    );
  });
</script>

<Card.Root class="md:w-[400px] w-full">
  <Card.Header>
    <div class="flex justify-between w-full">
      <div class="flex flex-col space-y-1 justify-center w-auto">
        <Card.Title>Currency Converter</Card.Title>
        <Card.Description class="text-xs">
          Convert {convert.from.currency} to {convert.to.fullName}
        </Card.Description>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onclick={() =>
          ([convert.from, convert.to] = [convert.to, convert.from])}
      >
        <Swap class="size-10" />
      </Button>
    </div>
  </Card.Header>
  <Card.Content class="flex items-center justify-center w-full space-x-4">
    <div class="flex flex-col justify-center space-y-2">
      <Label for="convertFrom">
        <CountryPicker
          bind:currCode={convert.from.currency}
          direction="from"
          fromCode={convert.from.currency}
        />
      </Label>
      <Input
        bind:value={convert.from.amount}
        name="convertFrom"
        type="number"
        inputmode="decimal"
        pattern="[0-9]+"
        oninput={(e) => convertFromFirstToSecond(e.currentTarget.value)}
      />
    </div>
    <div class="flex flex-col justify-center space-y-2">
      <Label for="convertTo">
        <CountryPicker
          bind:currCode={convert.to.currency}
          direction="to"
          fromCode={convert.from.currency}
        />
      </Label>
      <Input
        bind:value={convert.to.amount}
        name="convertTo"
        type="number"
        inputmode="decimal"
        pattern="[0-9]+"
        oninput={(e) => convertFromSecondToFirst(e.currentTarget.value)}
      />
    </div>
  </Card.Content>
  <Card.Footer class="flex flex-col space-y-2">
    <Button
      class="w-full"
      onclick={() => ([convert.from.amount, convert.to.amount] = ["0", "0"])}
    >
      Clear
    </Button>
    <Separator />
    <div class="flex items-center justify-end w-full space-x-2">
      <Switch
        name="customRateSwitch"
        bind:checked={customRateEnabled}
        onCheckedChange={(checked) => {
          console.log("changed");
          if (!checked) {
            convert.from.conversionRate = originalConversionRate;
          }
        }}
      />
      <Label for="customRateSwitch" class="font-normal text-nowrap">
        Custom Rate
      </Label>
      <Input
        bind:value={convert.from.conversionRate}
        type="number"
        inputmode="decimal"
        pattern="[0-9]+"
        disabled={!customRateEnabled}
      />
    </div>
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
            {#if offline}
              Couldn't get the conversion rate.
            {:else}
              1 {convert.from.currency} = {convert.from.conversionRate &&
                formatRate(convert.from.conversionRate)}
              {convert.to.currency}
            {/if}
          </p>
          <p class="text-xs text-muted-foreground">
            {#if offline}
              Try again when online.
            {:else}
              Updated {convert.from.refreshDate &&
                convert.from.refreshDate.toLocaleString("en-US")}
            {/if}
          </p>
        {/if}
      </div>
    </div>
  </Card.Footer>
</Card.Root>
