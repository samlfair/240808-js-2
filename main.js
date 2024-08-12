import {
  storyblokInit,
  apiPlugin,
  renderRichText,
  useStoryblokBridge
} from "@storyblok/js"

if (window) {
  const { StoryblokBridge } = window
  console.log({ StoryblokBridge })
}

console.log("Hey!")

function PopularArticle() {
  return `<pre>Popular articles</pre>`
}

function Feature() {
  return `<pre>Features</pre>`
}

function Text() {
  return `<pre>Text</pre>`
}

const bloks = {
  feature: Feature,
  text: Text,
  "popular-article": PopularArticle
}

function assembleBloks(body) {
  let html = ""
  for (let i = 0; i < body.length; i++) {
    html += bloks[body[i].component]()
  }
  return html
}

async function init() {

  try {

    // const bridge = new StoryblokBridge()
    // bridge.on(['published', 'change'], () => {
    //   location.reload(true)
    // })

    const { storyblokApi } = storyblokInit({
      accessToken: "TVXPt5jM5QK82BUWLOlulgtt",
      use: [apiPlugin]
    })

    const { data } = await storyblokApi.get("cdn/stories/home")
    const { story } = data
    const { id } = story

    const div = document.getElementById("app")

    const html = JSON.stringify(story, null, 2)

    div.innerHTML = assembleBloks(story.content.body)

    const whatAmI = await useStoryblokBridge(id, story => {
      console.log({ story })
    })

    console.log({ whatAmI })

  } catch (error) {
    console.log({ error })
  }
}

init()
