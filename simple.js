import {
  storyblokInit,
  apiPlugin,
  renderRichText,
  storyblokEditable
} from "@storyblok/js"

if (window) {
  const { StoryblokBridge } = window

  const bridge = new StoryblokBridge()

  // Reload the page on changes
  bridge.on(['published', 'change'], () => {
    location.reload(true)
  })
}

async function init() {
  try {
    const { storyblokApi } = storyblokInit({
      accessToken: "YOUR_ACCESS_TOKEN",
      use: [apiPlugin]
    })

    const { data } = await storyblokApi.get("cdn/stories/home",
      { version: "draft" }
    )

    const { story } = data

    const div = document.getElementById("app")
    const editMarkers = storyblokEditable(story.content.body)

    div.innerHTML = `
      ${story.content._editable}
      <div class="content-type">
        <div class="blok" 
          data-blok-c=${editMarkers["data-blok-c"]} 
          data-blok-uid=${editMarkers["data-blok-uid"]}
        >
          ${renderRichText(story.content.body.rich_text)}
        </div>
      </div>`

  } catch (error) {
    console.log({ error })
  }
}

init()
