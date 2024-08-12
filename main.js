import {
  storyblokInit,
  apiPlugin,
  renderRichText,
  useStoryblokBridge,
  storyblokEditable
} from "@storyblok/js"

if (window) {
  const { StoryblokBridge } = window

  const bridge = new StoryblokBridge()
  bridge.on(['published', 'change'], () => {
    location.reload(true)
  })
  console.log({ bridge })
}

function PopularArticle(blok) {
  const editMarkers = storyblokEditable(blok)
  return `<div class="blok" data-blok-c=${editMarkers["data-blok-c"]} data-blok-uid=${editMarkers["data-blok-uid"]}>${JSON.stringify(blok.articles, null, 2)}</div>`
}

function Feature(blok) {
  const editMarkers = storyblokEditable(blok)
  return `<div class="blok" data-blok-c=${editMarkers["data-blok-c"]} data-blok-uid=${editMarkers["data-blok-uid"]}>${blok.name}</div>`
}

function Text(blok) {
  const editMarkers = storyblokEditable(blok)
  return `<div class="blok" data-blok-c=${editMarkers["data-blok-c"]} data-blok-uid=${editMarkers["data-blok-uid"]}>${renderRichText(blok.rich_text)}</div>`
}

const bloks = {
  feature: Feature,
  text: Text,
  "popular-article": PopularArticle
}

function assembleBloks(body) {
  let html = ""
  for (let i = 0; i < body.length; i++) {
    html += bloks[body[i].component](body[i])
  }
  return html
}

async function init() {

  try {
    const { storyblokApi } = storyblokInit({
      accessToken: "TVXPt5jM5QK82BUWLOlulgtt",
      use: [apiPlugin]
    })

    const { data } = await storyblokApi.get("cdn/stories/home",
      { version: "draft" }
    )
    console.log({ data })
    const { story } = data
    const { id } = story

    const div = document.getElementById("app")

    div.innerHTML = `
    ${story.content._editable}
    <div class="content-type">
    ${assembleBloks(story.content.body)}
    </div>
    `

  } catch (error) {
    console.log({ error })
  }
}

init()
