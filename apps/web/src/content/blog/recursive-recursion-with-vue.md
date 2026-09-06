---
title: "Recursive Recursion with Vue"
date: 2018-07-25
excerpt: "We've been working on a project with some of the folks from the medical campus since I've been at VCU. They are developing a large OER site for Histology, which is the study of cells, but we're approa"
heroImage: "/media/vue.jpg"
categories: ["JavaScript", "Vue"]
wpId: 1816
---

We've been working on a project with some of the folks from the medical campus since I've been at VCU. They are developing a large OER site for Histology, which is the study of cells, but we're approaching a point where this single site has over 1000 pages in a nested menu structure. Since the concept hierarchy is pretty critical to the subject matter, going from say Organs & Systems > Cardiovascular > Vessels > Capillaries, it is important that this structure is presented for the students to aide in their understanding as well. Since most WordPress sites don't tend to get this large, it was predictable that the built in Nav Walker code to generate the menu structure started to get bogged down by sheer number of pages here. And we're talking like 10-20 second loads for this menu markup. To work around this, I wrote a really quick plugin that essentially dumps a subset of data for all published pages in a flat JSON file in the wp-content directory every time a post or page is created or updated.

```php
function create_menu($post_id) {
    global $wpdb;
    $results = $wpdb->get_results( "SELECT `ID`, `post_title`, `post_parent`, `post_name`, `guid` FROM {$wpdb->prefix}posts WHERE post_type='page' and post_status = 'publish' ", ARRAY_A );
    file_put_contents(plugin_dir_path(__FILE__) . 'results.json', json_encode($results));

}
add_action('save_post', 'create_menu');
```

It is able to do that without slowing anything on the backend down, and then we can offload the render of the full menu until after the actual HTML page has rendered using AJAX and JS. However, while the JSON data is lightweight, it also means I had to write some code to reverse engineer the existing menu structure into a tree structure. To do that, I had to write some recursive code in JavaScript to parse the JSON data into a hierarchy. While I generally feel pretty comfortable with most programming stuff, there are basic CS-ish concepts like this one that I still have no formal background in.

```null
createTree: function () {
                    fetch('https://rampagesdev.reclaimhosting.com/wp-content/plugins/menu-cache-plugin/results.json')
                    .then(result => {
                        result.json().then(json => {

                            function parseTree(nodes, parentID){
                                let tree = []
                                let length = nodes.length

                                for (let i = 0; i < length; i++){
                                    let node = nodes[i]
                                    if(node.post_parent == parentID){
                                        let children = parseTree(nodes, node.ID)

                                        if (children.length > 0) {
                                            node.children = children
                                        }

                                        tree.push(node)
                                    }
                                }

                                return tree
                            }

                            const completeTree = parseTree(json, "0")
                            this.tree = completeTree
                            console.log(completeTree)
                        })
                    })
                }
```

I attached this to a Vue instance as a method and called it during the mounted lifecycle hook of the component and set a reactive data property called 'tree' equal to the parsed tree of the menu. From here, I started writing some basic templating to render the menu hierarchy from the parsed structure, but since there is little consistency in the depth of some of the menu branches, quickly got bogged down by writing a bunch of nested v-for loops. That seemed like a pretty bad pattern, so I thought if I can use recursion to solve the first problem relating to the creation of a nested hierarchy, can I use the same strategy to render that pattern as well. It turns out that recursive components are well-documented in Vue, and can be used with the caveat that you avoid endless loops. Somewhere the condition to recurse must evaluate to false. So, I extended my basic child component to recursively render nested ULs and LIs for as long as it is able:

```js
Vue.component('child-component', {
            template : `<li>

                    <a v-if="child.children[0].children" v-bind:href="child.guid">{{child.post_title}}</a>
                    <a v-if="!child.children[0].children" v-bind:href="child.children[0].guid">{{child.post_title}}</a>

                    <ul v-if="child.children && child.children[0].children">
                        <child-component v-for="grandchild in child.children" :key="grandchild.ID" :child="grandchild">
                        </child-component>
                    </ul>

                    </li>`,
            props: ['child']
        })
```

I'm sure most of this stuff would have been obvious to someone with a formal CS background, but hopefully this will be helpful to someone else as they try to work with recursion in either JS processing or UI development.
