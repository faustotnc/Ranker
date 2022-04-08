import { Box, Divider, Typography } from "@mui/material";
import * as React from "react";
import { ReactComponent as LimitationsGraph } from "../../../../limitations.svg";
import { ReactComponent as ExampleGraph } from "../../../../web-graph.drawio.svg";
import KatexEq from "../../KatexEq/KetexEq";

interface InfoContentProps {}

const InfoContent: React.FunctionComponent<InfoContentProps> = () => {
   return (
      <Box sx={{ a: { color: "inherit", fontWeight: "bold" } }}>
         <Typography variant="h5">Graphs to Model the Web</Typography>
         <br />

         <Typography variant="body2" component="p">
            Graphs are powerful mathematical structures that allow us to model many of the processes we encouncter in
            the world every day. Some of these processes include user interactions in social media, clusters of globally
            interconnected computers, cities connected by roads and bridges, airline transportation endpoints, and many
            more.
         </Typography>
         <br />

         <Typography variant="body2" component="p">
            Another interesting application of graphs is the World Wide Web, which arose with the invention of the
            internet. As the name suggests, the world-wide-web is a network of websites and other resources stored in
            servers around the world. The “network” in the world-wide-web comes from the fact that these websites can
            have hyperlinks pointing to one another.
         </Typography>
         <br />

         <Typography variant="body2" component="p">
            Now, here is a question: If you search for the term “newspaper” in your favorite search engine, what results
            should you expect? Without any context to help the search engine, it would be reasonable for it to display
            links to websites like &quot;nytimes.com&quot; or &quot;washingtonpost.com.&quot; It would also be
            reasonable for it to display a link to a website that contains the definition of the word
            &quot;newspaper&quot; or a link to a website that points to many other newspapers. Although all of these
            options are equally valid, not all websites are equally important. With this in mind, two new questions
            arise: how should the engine prioritize websites in the world-wide-web based on their rank or importance?
            And, what metrics can we use to define a website&apos;s rank?
         </Typography>
         <br />

         <Typography variant="h5">Network Flows and Random Surfers</Typography>
         <br />

         <Typography variant="body2" component="p">
            Consider the following scenario: A person searches for the term &quot;microbiology&quot; in their favorite
            search engine. The engine finds two websites that match the term: www.mcb.harvard.edu and www.yougotbio.com.
            Without any knowledge bias, which result should the engine display first? One way to approach this is to
            look at the total number websites in the world-wide-web that point to each one of the search results. The
            chances are that www.mcb.harvard.edu will have many more websites pointing to it than www.yougotbio.com.
         </Typography>
         <br />

         <Typography variant="h6">The Intuition</Typography>
         <Typography variant="body2" component="p">
            Since websites are more important if many people visit them often, we need to find which websites people
            visit the most. However, it would be almost impossible (and inefficient) to create a system that tracks
            every step every person takes on the internet. Instead, we can resort to approximations.
         </Typography>
         <br />

         <Typography variant="h6">The Random Surfer Model</Typography>
         <Typography variant="body2" component="p">
            The “Random Surfer” model relies on the assumption that people will randomly follow links from one website
            to another. That is, a person starts at a random website, then randomly visits a link from that website to
            another, and keeps repeating this process indefinitely (always randomly choosing a link from the website it
            is currently at).
         </Typography>
         <br />

         <Typography variant="h6">PageRank</Typography>
         <Typography variant="body2" component="p">
            We define the PageRank of a website <KatexEq>{"Pr(w_j)"}</KatexEq> as being the limiting probability of a
            random surfer being at <KatexEq>{"w_j"}</KatexEq> at any point in time <KatexEq>{"t"}</KatexEq>. This turns
            out to be a recursive problem since, at time <KatexEq>{"t-1"}</KatexEq>, the surfer was at a website that
            points to <KatexEq>{"w_j"}</KatexEq> (i.e., <KatexEq>{" w_{j-1}"}</KatexEq>), at time{" "}
            <KatexEq>{"t-2"}</KatexEq> it was at a website that points to <KatexEq>{" w_{j-1}"}</KatexEq> (i.e.,{" "}
            <KatexEq>{" w_{j-2}"}</KatexEq>), and so on. So, the rank of a website is proportional to the ranks of all
            the websites that point to it.
            {/* <Box
               component="span"
               sx={{ display: "block", with: "100%", textAlign: "center", img: { width: "80%", mt: "24px" } }}
            >
               <img src={RandomSurfer} alt="random surfer model" />
            </Box> */}
         </Typography>
         <br />

         <Typography variant="h6">The “Flow” Model</Typography>
         <Typography variant="body2" component="p">
            The recursive nature of the PageRank algorithm leads to a very nice formula for the rank{" "}
            <KatexEq>{" r_j"}</KatexEq> of a website <KatexEq>{" w_j"}</KatexEq>:
         </Typography>

         <div className="equation" style={{ fontSize: "24px" }}>
            <KatexEq>{"r_j = \\displaystyle\\sum_{i \\rightarrow j}{\\big ( \\frac{r_i}{d_i} \\big ) }"}</KatexEq>
         </div>

         <Typography variant="body2" component="p">
            In this formula, <KatexEq>{"i \\rightarrow j"}</KatexEq> are all the websites pointing to{" "}
            <KatexEq>{"j"}</KatexEq>, <KatexEq>{"r_i"}</KatexEq> represents the rank of the <KatexEq>{"i"}</KatexEq>th
            website pointing to <KatexEq>{"j"}</KatexEq>, and <KatexEq>{"d_i"}</KatexEq> is the degree (total number of
            outgoing links) of the <KatexEq>{"i"}</KatexEq>th website pointing to <KatexEq>{"j"}</KatexEq>. For
            concreteness, take the following graph:
         </Typography>
         <br />

         <Box
            sx={{
               textAlign: "center",
               svg: { width: "75%", maxWidth: "350px" },
               "*": { color: "primary.main", stroke: (t) => t.palette.primary.main },
            }}
         >
            <ExampleGraph></ExampleGraph>
         </Box>
         <br />

         <Typography variant="body2" component="p">
            This graph produces a set of three rank equations and three unknowns:
         </Typography>

         <div className="equation" style={{ fontSize: "24px" }}>
            <KatexEq>{"r_a = \\frac{r_a}{2} + \\frac{r_b}{2}"}</KatexEq>
         </div>
         <div className="equation" style={{ fontSize: "24px" }}>
            <KatexEq>{"r_b = \\frac{r_a}{2} + \\frac{r_c}{1}"}</KatexEq>
         </div>
         <div className="equation" style={{ fontSize: "24px" }}>
            <KatexEq>{"r_c = \\frac{r_b}{2}"}</KatexEq>
         </div>

         <Typography variant="body2" component="p">
            This system of equations helps to clarify what we mean by the &quot;network flow&quot; intuition: You can
            think of a website as containing some amount of &quot;rank fluid&quot; which it obtained from all other
            websites pointing to it. That website&apos;s fluid is then distributed across all of the links leaving it,
            and continues to flow from one website to another until it is stable. Moreover, the entire system can only
            have a constant amount of fluid <KatexEq>{"c"}</KatexEq> at any point in time. Formally, we say that
         </Typography>

         <div className="equation" style={{ fontSize: "24px" }}>
            <KatexEq>{"\\displaystyle\\sum_{k}{r_k} = c"}</KatexEq>
         </div>

         <Typography variant="body2" component="p">
            In the case of the PageRank algorithm the sum of all the ranks must add up to 1 (i.e.,{" "}
            <KatexEq>{"c=1"}</KatexEq>) since we wish to find the limiting <i>probability</i> of the surfer being on a
            website at any point in time.
         </Typography>
         <br />

         <Typography variant="h5">Eigenvector Formulation</Typography>
         <br />

         <Typography variant="body2" component="p">
            Naturally, we can represent the linear system of equations as a matrix, and use our linear algebra knowledge
            to solve for each value of <KatexEq>{"r"}</KatexEq>. For the current example, the matrix-vector form looks
            like this:
         </Typography>

         <div className="equation" style={{ fontSize: window.innerWidth >= 350 ? "18px" : "16px" }}>
            <KatexEq>
               {
                  "\\begin{bmatrix} r_a \\\\ r_b \\\\ r_c \\end{bmatrix} = \\begin{bmatrix} 1/2 & 1/2 & 0 \\\\ 1/2 & 0 & 1 \\\\ 0 & 1/2 & 0 \\end{bmatrix}\\begin{bmatrix} r_a \\\\ r_b \\\\ r_c \\end{bmatrix}"
               }
            </KatexEq>
         </div>

         <Typography variant="body2" component="p">
            A couple of interesting details arise from the matrix representation of our PageRank network-flow system:
         </Typography>

         <ol style={{ paddingLeft: "48px", paddingTop: "8px" }}>
            <li>
               <Typography variant="body2" component="p">
                  The entire system can be summarized with one equation: <KatexEq>{"r=Mr"}</KatexEq>.
               </Typography>
            </li>
            <li>
               <Typography variant="body2" component="p">
                  <KatexEq>{"M"}</KatexEq> is a{" "}
                  <a href="https://en.wikipedia.org/wiki/Stochastic_matrix" target="_blank" rel="noreferrer">
                     column-stochastic
                  </a>{" "}
                  transition matrix: it has non-negative columns whose elements add up to 1. However, as we&apos;ll see
                  later, this isn&apos;t always true.
               </Typography>
            </li>
            <li>
               <Typography variant="body2" component="p">
                  The rank vector <KatexEq>{"r"}</KatexEq> is an eigenvector of <KatexEq>{"M"}</KatexEq>. In fact, it is
                  the{" "}
                  <a href="https://en.wikipedia.org/wiki/Eigenvalues_and_eigenvectors" target="_blank" rel="noreferrer">
                     principal eigenvector
                  </a>{" "}
                  of <KatexEq>{"M"}</KatexEq> with corresponding eigenvalue of 1. This is because, by definition,{" "}
                  <KatexEq>{"x"}</KatexEq> is an eigenvector of <KatexEq>{"A"}</KatexEq> with corresponding eigenvalue{" "}
                  <KatexEq>{"\\lambda"}</KatexEq> if and only if <KatexEq>{"\\lambda x = Ax"}</KatexEq>.
               </Typography>
            </li>
            <li>
               <Typography variant="body2" component="p">
                  Let <KatexEq>{"\\rho=Mr"}</KatexEq>, then <KatexEq>{"\\rho_j\\leq1"}</KatexEq> since we know that{" "}
                  <KatexEq>{"r"}</KatexEq> is unit length and that each column of <KatexEq>{"M"}</KatexEq> sums to 1.
               </Typography>
            </li>
         </ol>
         <br />

         <Typography variant="h6">
            Solving for <KatexEq>{"r"}</KatexEq>
         </Typography>
         <Typography variant="body2" component="p">
            Solving for <KatexEq>{"r"}</KatexEq> is as simple as finding the principal eigenvector of{" "}
            <KatexEq>{"M"}</KatexEq>. To do so programmatically, we can use a powerful technique called{" "}
            <a href="https://en.wikipedia.org/wiki/Power_iteration" target="_blank" rel="noreferrer">
               power iteration
            </a>
            . This technique is described by the following recursive formula:
         </Typography>

         <div className="equation" style={{ fontSize: "24px" }}>
            <KatexEq>{"r^{(n+1)} = \\frac{M r^{(n)}}{||M r^{(n)} ||}"}</KatexEq>
         </div>

         <Typography variant="body2" component="p" className="caption-text">
            However, in the case of PageRank, the matrix <KatexEq>M</KatexEq> is column-stochastic and{" "}
            <KatexEq>{"r"}</KatexEq> is a probability vector, therefore, <KatexEq>{"||M r^{(n)} || = 1"}</KatexEq>, and
            we can reduce the power iteration formula to:
         </Typography>

         <div className="equation">
            <KatexEq>{"r^{(n+1)} = M r^{(n)}"}</KatexEq>
         </div>

         <Typography variant="body2" component="p" className="caption-text">
            Isn&apos;t this beautiful? Our entire system for finding the importance of a website boiled down to a series
            of matrix-vector multiplications. Here is how this power-iteration loop works:
         </Typography>

         <ol style={{ paddingLeft: "48px", paddingTop: "8px" }}>
            <li>
               <Typography variant="body2" component="p">
                  Initialize <KatexEq>{"r"}</KatexEq> to <KatexEq>{"1/N"}</KatexEq>, where <KatexEq>{"N"}</KatexEq> is
                  the number of nodes in our graph. For an internet-sized graph, <KatexEq>{"N"}</KatexEq> would be the
                  total number of pages in the world-wide-web.
               </Typography>
            </li>
            <li>
               <Typography variant="body2" component="p">
                  Multiply <KatexEq>{"M"}</KatexEq> with <KatexEq>{"r"}</KatexEq>. This will result in a new vector{" "}
                  <KatexEq>{"r'"}</KatexEq>.
               </Typography>
            </li>
            <li>
               <Typography variant="body2" component="p">
                  Update <KatexEq>{"r"}</KatexEq> by setting it equal to <KatexEq>{"r'"}</KatexEq>.
               </Typography>
            </li>
            <li>
               <Typography variant="body2" component="p">
                  Go to step #2. Stop the loop when <KatexEq>{"||r' - r|| \\lt \\epsilon"}</KatexEq>, where{" "}
                  <KatexEq>{"\\epsilon"}</KatexEq> is some small number greater than or equal to zero.
               </Typography>
            </li>
         </ol>
         <br />

         <Typography variant="body2" component="p" className="caption-text">
            And that is it! After enough iterations, <KatexEq>{"r"}</KatexEq> will settle to be the limiting probability
            vector we had been looking for. Each component of this final vector will be the probability of a random
            surfer being at any of the nodes at any point in time, i.e., the rank of each node in the graph.
         </Typography>
         <br />

         <Typography variant="body2" component="p" className="caption-text">
            You are welcome to try this out for yourself with the graph I introduced a while ago, either by hand or
            using Ranker to help you. If you decide to use Ranker, pay close attention to vector{" "}
            <KatexEq>{"r"}</KatexEq> displayed on the right-hand side of the screen on desktop devices.
         </Typography>
         <br />

         <Typography variant="body2" component="p" className="caption-text">
            (To be continued...)
         </Typography>
         <br />


         {/* <Typography variant="h5">Limitations</Typography>
         <br />
         <Typography variant="body2" component="p" className="caption-text">
            As I mentioned a while ago, a nice result of the matrix-vector form of our network-flow system of equations
            is that the matrix <KatexEq>{"M"}</KatexEq> is column-stochastic. Or at least it should be. Consider the
            following graph and its corresponding system of equations:
         </Typography>
         <br />

         <Box
            sx={{
               display: "flex",
               alignItems: "center",
               "@media screen and (max-width: 712px)": { flexDirection: "column" },
            }}
         >
            <Box
               sx={{
                  textAlign: "center",
                  svg: { width: "75%", maxWidth: "350px" },
                  "*": { color: "primary.main", stroke: (t) => t.palette.primary.main },
               }}
            >
               <LimitationsGraph></LimitationsGraph>
            </Box>

            <Box
               className="equation"
               sx={{
                  fontSize: "16px !important",
               }}
            >
               <KatexEq>
                  {
                     "\\begin{bmatrix} r_a \\\\ r_b \\\\ r_c \\\\ r_d \\end{bmatrix} = \\begin{bmatrix} 0 & 0 & 0 & 0 \\\\ 1/3 & 0 & 1 & 0 \\\\ 1/3 & 1 & 0 & 0 \\\\ 1/3 & 0 & 0 & 0 \\end{bmatrix}\\begin{bmatrix} r_a \\\\ r_b \\\\ r_c \\\\ r_d \\end{bmatrix}"
                  }
               </KatexEq>
            </Box>
         </Box>
         <br />

         <Typography variant="body2" component="p" className="caption-text">
            If you run the power iteration algorithm on this graph, you will notice some interesting results: nodes a
            and d will end up with a rank of zero, while nodes b and c will each get 0.5 as their rank. Although this is
            the correct result algorithmically speaking, it is not the result we expected intuitively. Nodes a and d
            should have <i>some</i> rank since they exist in the graph, and nodes b and c should not hold all of the
            rank, since they share the graph with other nodes. There are two issues with this graph based on our current
            network-flow formulation:
         </Typography>

         <ol style={{ paddingLeft: "48px", paddingTop: "8px" }}>
            <li>
               <Typography variant="body2" component="p">
                  <b>Dead-ends:</b> You may have noticed that the last column of M is all zeros. This is because the
                  node d does not have any outgoing links, which is a <i>real</i> issue since it prevents our matrix
                  from being &quot;true&quot; column-stochastic. Going with the same &quot;rank fluid&quot; analogy I
                  mentioned earlier, having a dead-end in our graph is like having a hole in the network that sucks all
                  of the fluid, eventually making all components of r become zero.
               </Typography>
            </li>
            <li>
               <Typography variant="body2" component="p">
                  <b>Spider-traps:</b> This isn&apos;t really an issue, but if you apply the power iteration algorithm
                  on a graph that has a spider trap, it runs the risk of either getting stuck on
               </Typography>
            </li>
         </ol>
         <br /> */}

         <Divider></Divider>
         <br />
         <Typography variant="caption" component="p">
            This tool was created by{" "}
            <a href="https://faustogerman.com" target="_blank" rel="noreferrer">
               Fausto German
            </a>{" "}
            at the University of North Carolina at Charlotte after taking one of his first data science theory classes:
            ITCS 3162 - Introduction to Data Mining, taught by Dr. Siddharth Krishnan.
         </Typography>
      </Box>
   );
};

export default InfoContent;
