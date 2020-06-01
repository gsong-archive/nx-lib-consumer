/** @jsx jsx */
import { jsx } from "@emotion/core";

import { Ui } from "@gsong/ui";

const App = () => (
  <main css={{ margin: "2rem" }}>
    <h1>App</h1>
    <section css={{ border: "1px solid lightgray", padding: "1rem" }}>
      <Ui />
    </section>
  </main>
);

export default App;
