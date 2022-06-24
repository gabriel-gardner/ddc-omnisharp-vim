import { BaseSource, Item } from "https://deno.land/x/ddc_vim@v2.2.0/types.ts";
import { GatherArguments } from "https://deno.land/x/ddc_vim@v2.2.0/base/source.ts";
import { vars } from "https://deno.land/x/ddc_vim@v2.2.0/deps.ts";

// I think this just ignores potential parameters to configure this source in ddc
type Params = Record<never, never>;

// Attempt adaptation of the omnisharp-vim deoplete source for ddc.vim
// This is a work in progress.

export class Source extends BaseSource<Params> {
  previousLhs = "";
  previousPartial = "";

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
    if (lhs != this.previousLhs || partial?.startsWith(this.previousPartial))
      {
        this.previousLhs = lhs!
        this.previousPartial = partial!
        args.denops.call(
          "deoplete#source#omnisharp#sendRequest",
          lhs,
          partial
        );
        return [];
      }

      // Get stored results from omnisharp-vim
      const results = await vars.g.get(
        args.denops,
        "deoplete#source#omnisharp#_results",
      ) as {
        words: string[];
      }

      // This is very likely wrong
      return results.words.map((word) => ({
        word: lhs,
        menu: word,
      }));
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

