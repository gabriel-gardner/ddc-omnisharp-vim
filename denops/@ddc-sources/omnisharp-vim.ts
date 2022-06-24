import { BaseSource, Item } from "https://deno.land/x/ddc_vim@v2.2.0/types.ts";
import { GatherArguments } from "https://deno.land/x/ddc_vim@v2.2.0/base/source.ts";

// I think this just ignores potential parameters to configure this source in ddc
type Params = Record<never, never>;

// Adaptation of the omnisharp-vim deoplete source for ddc.vim
// Modeled off of the python interpretation

export class Source extends BaseSource<Params> {
  previousLhs = "";
  previousPartial = "";
  cachedResults: Item[] = [];

  async gather(
    args: GatherArguments<Params>,
  ): Promise<Item[]> {

    // Get current input at cursor?
    const currentInput = args.context.input;

    // Regex the input
    const [lhs, partial] = this.parseInput(currentInput);

    if (!lhs) {
      return [];
    }

    // Call omnisharp-vim to get completions
    if (lhs != this.previousLhs || !partial?.startsWith(this.previousPartial)) {
      this.previousLhs = lhs!
      this.previousPartial = partial!
      this.cachedResults = await args.denops.call(
          "OmniSharp#actions#complete#Get",
          partial,
        ) as Item[];
    }

    return this.cachedResults;
  }

  private parseInput(
    input: string,
  ): [string | undefined, string | undefined] {

    // Attempted to adapt from the python regex in the deoplete source
    const match = input.match(/^(?<firstgroup>.*\W)(?<secondgroup>\w*)$/);

    if (match !== null) {
      return [match?.groups?.firstgroup, match?.groups?.secondgroup];
    }

    return [undefined, undefined];
  }

  params(): Params {
    return {
      kindLabels: {},
    };
  }
}

