import {
  BaseSource,
  Item,
} from "https://deno.land/x/ddc_vim@v2.2.0/types.ts";
import {
  GatherArguments,
} from "https://deno.land/x/ddc_vim@v2.2.0/base/source.ts";
import { vars } from "https://deno.land/x/ddc_vim@v2.2.0/deps.ts";

type Params = Record<never, never>;


export class Source extends BaseSource<Params> {
  private previousLhs = "";
  private previousPartial = "";
  async gather(
    args: GatherArguments<Params>,
  ): Promise<Item[]> {
      const currentInput = args.context.input;

      const [lhs, partial] = this.parseInput(currentInput);

      if (!lhs) {
        return [];
    }

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

        const results = await vars.g.get(
          args.denops,
          "deoplete#source#omnisharp#_results",
        ) as {
            words: string[];
        }
        return results.words.map((word) => ({
          word: lhs,
          menu: word,
        }));
  }

  private parseInput(
    input: string,
  ): [string | undefined, string | undefined] {
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

