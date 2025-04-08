# org-roam-ui: a graphical frontend for your org-roam Zettelkasten

<img width="1440" alt="Screenshot 2021-10-12 at 12 51 39" src="https://user-images.githubusercontent.com/21983833/136942774-3f293f65-dbd4-4479-b530-1fde738c5289.png">

Org-Roam-UI is a frontend for exploring and interacting with your [org-roam](https://github.com/org-roam/org-roam) notes.
Org-roam-ui's main feature is the ability to generate a graph visualization of your org-roam notes.

## Installation

org-roam-ui requires `org-roam`, `websocket`, `simple-httpd`, `f` and Emacs >= 27 for fast JSON parsing.

### package.el

```
M-x package-install org-roam-ui
```

No configuration is necessary when you use `package.el` to install ORUI.

### Doom

Add the following to your `package.el`

Org-roam-ui tries to keep up with the latest features of `org-roam`, which conflicts with Doom Emacs's desire for
stability. To make sure nothing breaks, use the latest version of `org-roam` by unpinning it.

```emacs-lisp
(unpin! org-roam)
(package! org-roam-ui)
```

Then something along the following to your `config.el`

```emacs-lisp
(use-package! websocket
    :after org-roam)

(use-package! org-roam-ui
    :after org-roam ;; or :after org
;;         normally we'd recommend hooking orui after org-roam, but since org-roam does not have
;;         a hookable mode anymore, you're advised to pick something yourself
;;         if you don't care about startup time, use
;;  :hook (after-init . org-roam-ui-mode)
    :config
    (setq org-roam-ui-sync-theme t
          org-roam-ui-follow t
          org-roam-ui-update-on-save t
          org-roam-ui-open-on-start t))

```

We recommend only loading org-roam-ui after loading org(-roam) as starting the server and making database requests can impact startup times quite a lot.

## Usage

Use `M-x org-roam-ui-mode RET` to enable the global mode.
It will start a web server on http://127.0.0.1:35901/ and connect to it via a WebSocket for real-time updates.

### Commands

ORUI provides a few commands for interacting with the graph without ever having to leave Emacs.
NOTE: This is quite janky at the moment and will change in the future. Consider this more of a teaser.

#### Moving around

```emacs-lisp
(org-roam-ui-node-zoom)
```

Zooms to the current node in the global view _ignoring local mode_.

```emacs-lisp
(org-roam-ui-node-local)
```

Opens the current node in local view.

You can optionally give these command three parameters:

1. the node id you want to zoom to (by default the current node)
2. The speed at which you want to zoom (can be set in the UI) in ms.
3. The padding of the zoom in px.

These options might not work at the moment, please configure them in the UI for the time being.

#### Manipulating graph

```emacs-lisp
(org-roam-ui-add-to-local-graph &optional id)
```

Adds the node with the given id to the local graph. If no id is given, the current node is used.
If the local graph is not open, it will be opened.

```emacs-lisp
(org-roam-ui-remove-from-local-graph &optional id)
```

Removes the node with the given id from the local graph. If no id is given, the current node is used.

### Configuration

Org-Roam-UI exposes a few variables, but most of the customization is done in the web app.

#### Following

ORUI follows you around Emacs by default. To disable this, set

```emacs-lisp
(setq org-roam-ui-follow nil)
```

or disable the minor mode `org-roam-ui-follow-mode`.

#### Updating

We plan to make updates to the graph happen smoothly, at the moment it is only possible to reload the entire graph when an update happens (but local mode is preserved). This is enabled by default, to disable

```emacs-lisp
(setq org-roam-ui-update-on-save nil)
```

#### Theme

Org-Roam-UI can sync your Emacs theme! This is the default behavior, to disable it do

```emacs-lisp
(setq org-roam-ui-sync-theme nil)
```

Then call `M-x org-roam-ui-sync-theme`.

You can also provide your own theme if you do not like syncing nor like the default one. To do so, set `org-roam-ui-custom-theme` to an alist of (rather specific) variables, like so

```emacs-lisp
(setq org-roam-ui-custom-theme
    '((bg . "#1E2029")
        (bg-alt . "#282a36")
        (fg . "#f8f8f2")
        (fg-alt . "#6272a4")
        (red . "#ff5555")
        (orange . "#f1fa8c")
        (yellow ."#ffb86c")
        (green . "#50fa7b")
        (cyan . "#8be9fd")
        (blue . "#ff79c6")
        (violet . "#8be9fd")
        (magenta . "#bd93f9")))
```

You can optionally provide `(base1 . "#XXXXXX")` arguments after the last one to also set the background shades, otherwise ORUI will guess based on the provides bg and fg.

### Open on start

By default, org-roam-ui will try to open itself in your default browser. To disable this, set

```emacs-lisp
(setq org-roam-ui-open-on-start nil)
```

## FAQ 🗨

### Q: Aaaaand it broke: what do?

Sorry! This is still alpha software, so expect it to break from time to time. Best thing you can try is to remove your settings by going to "Storage > Local Storage" on Firefox or "Application > Local Storage" on Chromium and deleting everything there.

If the issue still persists, please file a bug report with

1. Your browsers console log
2. Your browsers
3. What you were doing when it broke

and we'll try to help you ASAP!

### Q: Clicking 'Open in Emacs' gives an error around json-parse-string, how do I fix this?

If you receive an error, in emacs, stating `function definition is void json-parse-string`, then you must compile emacs with json support. This is not automatically done on systems such as Gentoo.

### Q: Graph Slow! Faster?

While we try to optimize the display of the graph, there is only so much we can do. For largish networks (>2k nodes) dragging the graph around a lot can cause some performance issues, but there are a few things you can do to speed it up.

#### Close the tweaks panel

At the time of writing (Aug 8) it is very much not optimized, and shifting between global and local mode or 2d or 3d is noticeably slower with the tweaks panel open than without. This will be fixed in a future release.

#### Use a Chromium based browser

As much as it saddens us to say, Firefox's rendering engine is quite a bit slower than its Chromium cousins. Compare the performance of the two and see if that's the main issue first.

#### Turn off the particles

I know, very cool to see those little guys travel up and down your notes, but very slow, especially in 3D mode.

#### Turn off labels

Probably the second slowest thing to render, with little possibility of speeding it up. Consider only turning on labels on highlight or cranking up the "Label appearance scale".

#### Turn off highlight animations

I know, they're gorgeous, but not very performant.

#### Turn off collision

Nice, but costly! If you like to have the graph more spread out, turning off collision will change little in the resulting layout, but will help performance quite a bit.

#### Turn off gravity

Fewer forces fewer worries

# Integrations with other Org-mode packages

## [md-roam](https://github.com/nobiot/md-roam)

Use markdown notes interchangeably with Org-mode notes!

# Contribute 💪

The best way to support the continued development of org-roam-ui is to get involved yourself!
To get started, simply

```bash
git clone https://github.com/org-roam/org-roam-ui
npm install
npm run dev
```

and a development server will be lauched on `localhost:3000`.

[GitHub Community Guidelines](https://docs.github.com/en/github/site-policy/github-community-guidelines) apply.
