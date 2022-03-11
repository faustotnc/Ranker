import { Box, Typography } from "@mui/material";
import * as React from "react";
import RandomSurfer from "../../../../random-surfer.png";
import KatexEq from "../../KatexEq/KetexEq";

interface InfoContentProps {}

const InfoContent: React.FunctionComponent<InfoContentProps> = () => {
   return (
      <>
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
            Another interesting application of graphs that arose with the invention of the internet is the World Wide
            Web, which, as the name suggests, is a network of websites and other resources stored in servers around the
            world. The “network” in the world-wide-web comes from the fact that these websites can have hyperlinks
            pointing to one another.
         </Typography>
         <br />
         <Typography variant="body2" component="p">
            Now, here is a question: If you search for the term “newspaper” in your favorite search engine, what results
            should you expect? Without any context to help the search engine, it would be reasonable for it to display
            links to websites like &quot;nytimes.com&quot; or &quot;washingtonpost.com.&quot; It would also be
            reasonable for it to display a link to a website that contains the definition of the word
            &quot;newspaper&quot; or a link to a website that points to many other newspapers. Although all of these
            options are equally valid, not all websites are equally important. With this in mind, two new questions
            arise: how should the engine prioritize websites on the world-wide-web based on their rank or importance?
            And, what metrics can we use to define a website&apos;s rank?
         </Typography>
         <br />
         <Typography variant="h5">Network Flows and Random Surfers</Typography>
         <br />
         <Typography variant="body2" component="p">
            Consider the following scenario: A person searches for the term &quot;microbiology&quot; in their favorite
            search engine. The engine finds two websites that match the term: www.mcb.harvard.edu and www.yougotbio.com.
            Without any knowledge bias, which result should the engine display first? One way to approach this is to
            look at how many websites in the world-wide-web point to each one of the search results. The chances are
            that www.mcb.harvard.edu will have many more websites pointing to it than www.yougotbio.com.
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
            <KatexEq>{" w_{j-2}"}</KatexEq>), and so on. So, the rank of a website is proportional to the rank of the
            websites that point to it.
            <Box
               component="span"
               sx={{ display: "block", with: "100%", textAlign: "center", img: { width: "80%", mt: "24px" } }}
            >
               <img src={RandomSurfer} alt="random surfer model" />
            </Box>
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
         <br />
         <Typography variant="caption" component="p">
            This tool was created by{" "}
            <Box component="span" sx={{ a: { color: "inherit", fontWeight: "bold" } }}>
               <a href="https://faustogerman.com" target="_blank" rel="noreferrer">
                  Fausto German
               </a>{" "}
            </Box>
            at the University of North Carolina at Charlotte after taking one of his first data science theory classes:
            ITCS 3162 - Introduction to Data Mining, taught by Dr. Siddharth Krishnan.
         </Typography>
      </>
   );
};

export default InfoContent;
