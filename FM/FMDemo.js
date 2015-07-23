/**
 * Created by christian.amlacher on 25.06.2015.
 */

function changedSelection(sender) {

    var selected = ((sender.diagram).selection.first()).data.ID;


    if (selected !== null) {

        var node = diagramSmall.findNodeForKey(selected);

        var highlighter = diagramSmall.parts;

        highlighter.each(function (h) {
            if (h instanceof go.Part) {
                //h.location = node.location;
                h.location = new go.Point(node.location.x + 70, node.location.y +20);

            }
        });

        var selectedText = diagramMain.parts;

        //selectedText = "Hallo";
        console.log("hallo5");

        //selectedText.each(function (t) {
        //    if (t instanceof go.Part) {
        //        //h.location = node.location;
        //        //t.text = node.data.key;
        //        t.Da.q[0].text = node.data.Term;

        //    }
        //});


        //if (!node.isTreeLeaf) {

        diagramTop.model.nodeDataArray = [];
        diagramLeft.model.nodeDataArray = [];
        diagramMain.model.nodeDataArray = [];

        //var topNodes = diagramTop.model.nodeDataArray;

        //topNodes = [];
        /*        var topNodesLength = topNodes.length;

         for (topNodesLength; topNodesLength > 0; topNodesLength--) {
         diagramTop.model.removeNodeData(topNodes[topNodesLength - 1]);
         }

         var leftNodes = diagramLeft.model.nodeDataArray;
         var leftNodesLength = leftNodes.length;

         for (leftNodesLength; leftNodesLength > 0; leftNodesLength--) {
         diagramLeft.model.removeNodeData(leftNodes[leftNodesLength - 1]);
         }

         var mainNodes = diagramMain.model.nodeDataArray;
         var mainNodesLength = mainNodes.length;

         for (mainNodesLength; mainNodesLength > 0; mainNodesLength--) {
         diagramMain.model.removeNodeData(mainNodes[mainNodesLength - 1]);
         }*/

        var level = node.findTreeLevel();

        if (level == 0) {

            var topLevelNodes = diagramSmall.findTreeRoots();
            topLevelNodes.each(function (t) {
                if (t instanceof go.Node) {

                    diagramLeft.model.addNodeData(t.data);
                }
            });
            diagramTop.model.addNodeData(node.data);
        }

        else {
            var parent = node.findTreeParentNode();

            var nearby = parent.findTreeChildrenNodes();


            // create the modelLeft using the same node data as in myFullDiagram's model
            nearby.each(function (n) {
                if (n instanceof go.Node) {
                    diagramLeft.model.addNodeData(n.data);

                }
            });


            diagramTop.model.addNodeData(parent.data);


            for (var i = 1; i < level; i++) {
                parent = parent.findTreeParentNode();

                diagramTop.model.addNodeData(parent.data);
            }
            diagramTop.model.addNodeData(node.data);


        }

        var expanded = node.findTreeChildrenNodes();

        expanded.each(function (e) {
            if (e instanceof go.Node) {
                diagramMain.model.addNodeData(e.data);
            }
        });


        //diagramLeft.model = modelLeft;
        //diagramTop.model = modelTop;

        // select the node at the diagram's focus
        diagramLeft.findPartForKey(selected).isSelected = true;
        diagramTop.findPartForKey(selected).isSelected = true;
    }
    //}
}

function init() {


    var $ = go.GraphObject.make;  // for conciseness in defining templates


    diagramTop = $(go.Diagram, "diagramTop", {
        //autoScale: go.Diagram.Uniform,
        contentAlignment: go.Spot.Center,
        isReadOnly: true,
        layout: $(go.TreeLayout, go.TreeLayout.AlignmentStart,
            {angle: 0, sorting: go.TreeLayout.SortingAscending}),
        maxSelectionCount: 1,
        // when the selection changes, update the contents of the myLocalDiagram
        //"ChangedSelection": showTopOnMainClick
        "ChangedSelection": changedSelection
    });

    diagramLeft = $(go.Diagram, "diagramLeft", {
        autoScale: go.Diagram.Uniform,
        contentAlignment: go.Spot.Center,
        isReadOnly: true,
        layout: $(go.TreeLayout,
            {angle: 90, sorting: go.TreeLayout.SortingAscending}),
        maxSelectionCount: 1,
        "ChangedSelection": changedSelection
    });

    diagramMain = $(go.Diagram, "diagramMain", {
        // position the graph in the middle of the diagram
        initialContentAlignment: go.Spot.Center,
        //initialAutoScale: go.Diagram.UniformToFill,
        layout: $(go.TreeLayout, go.TreeLayout.ArrangementHorizontal,// specify a Diagram.layout that arranges trees
            {angle: 90, layerSpacing: 35}),
        //"grid.visible": true,
        allowMove: false,
        maxSelectionCount: 1,  // only one node may be selected at a time in each diagram
        // when the selection changes, update the myLocalDiagram view
        "ChangedSelection": changedSelection
    });

    diagramSmall = $(go.Diagram, "diagramSmall", {
        // position the graph in the middle of the diagram
        initialContentAlignment: go.Spot.LeftCenter,
        //initialAutoScale: 5,
        initialAutoScale: go.Diagram.UniformToFill,
        layout: $(go.TreeLayout, go.TreeLayout.ArrangementVertical,go.TreeLayout.AlignmentStart,{
            angle: 0,
            layerSpacing: 100

        }),
        //"grid.visible": true,
        allowMove: false,
        maxSelectionCount: 1,  // only one node may be selected at a time in each diagram
        // when the selection changes, update the myLocalDiagram view
        "ChangedSelection": changedSelection
    });

    function getColor(data, node) {
        var stringPath = data;
        var color = "";
        var positonOfFirstColon = data.indexOf(":");
        if (positonOfFirstColon > -1) {
            stringPath = stringPath.substr(0, positonOfFirstColon)
        }

        switch (stringPath) {
            case "Kernprozess":
                color = "red";
                break;
            case "Unterst�tzungsprozess":
                color = "blue";
                break;
            case "Unterstützungsprozess":
                color = "blue";
                break;
            case "Managementprozess":
                color = "green";
                break;
            default:
                color = "yellow";
        }
        return color;
    }

    //region startTemplate
    var startTemplate =
        $(go.Node, "Auto",
            {isTreeExpanded: false},
            //new go.Binding("key","ID"),
            $(go.Shape, "RoundedRectangle",
                new go.Binding("fill", "Path", getColor),
                new go.Binding("stroke", "isSelected", function (s) {
                    return s ? "red" : "yellow";
                }).ofObject()
            ),

            $(go.TextBlock, {
                    stroke: "white",
                    font: "12pt arial",
                    textAlign: "center",
                    overflow: go.TextBlock.OverflowEllipsis,
                    margin: 30,
                    maxLines: 1,
                    width: 150,
                    toolTip: $(go.Adornment, "Auto",
                        $(go.Shape, {fill: "#FFFFCC"}),
                        $(go.TextBlock, {margin: 4},
                            new go.Binding("text", "Path"))
                    )
                },
                new go.Binding("text", "Term")
            ),
            $("TreeExpanderButton",
                {
                    alignment: go.Spot.RightCenter
                }
            ),
            {
                click: function (e, obj) {
                    changeCategory(e, obj);
                }
            }
        );
    //endregion

    //region firstTemplate
    var firstTemplate =
        $(go.Node, "Auto",
            {isTreeExpanded: true},
            $(go.Shape, "RoundedRectangle",
                new go.Binding("fill", "Path", getColor),
                new go.Binding("stroke", "isSelected", function (s) {
                    return s ? "red" : "yellow";
                }).ofObject()
            ),

            $(go.TextBlock, {
                    stroke: "white",
                    font: "10pt arial",
                    textAlign: "center",
                    overflow: go.TextBlock.OverflowEllipsis,
                    margin: 15,
                    maxLines: 1,
                    width: 100,
                    toolTip: $(go.Adornment, "Auto",
                        $(go.Shape, {fill: "#FFFFCC"}),
                        $(go.TextBlock, {margin: 4},
                            new go.Binding("text", "Path"))
                    )
                },
                new go.Binding("text", "Term")
            ),

            $("TreeExpanderButton",
                {
                    alignment: go.Spot.RightCenter

                }
            ), // end TreeExpanderButton

            {
                click: function (e, obj) {
                    changeCategory(e, obj);
                }
            }
        );
    //endregion

    //region linkTemplate
    var linkTemplate =
        $(go.Link,
            {routing: go.Link.Orthogonal, corner: 5},
            $(go.Shape, {strokeWidth: 2, stroke: "#999"})); // the link shape

    diagramMain.linkTemplate = linkTemplate;

    diagramLeft.linkTemplate = linkTemplate;

    diagramTop.linkTemplate = linkTemplate;

    diagramSmall.linkTemplate = linkTemplate;
    //endregion

    var templmap = new go.Map("string", go.Node);
    templmap.add("start", startTemplate);
    templmap.add("first", firstTemplate);
    templmap.add("", firstTemplate);
    //diagramMain.nodeTemplateMap = templmap;

    diagramMain.nodeTemplate = startTemplate;
    diagramLeft.nodeTemplate = firstTemplate;
    diagramTop.nodeTemplate = firstTemplate;
    diagramSmall.nodeTemplate = firstTemplate;

    diagramSmall.model = new $(go.TreeModel, getData());

    var modelMain = new go.TreeModel();
    modelMain.nodeKeyProperty = "ID";

    var modelTop = new go.TreeModel();
    modelTop.nodeKeyProperty = "ID";
    diagramTop.model = modelTop;

    var modelLeft = new go.TreeModel();
    modelLeft.nodeKeyProperty = "ID";
    diagramLeft.model = modelLeft;

    var topLevelNodesOfSmall = diagramSmall.findTreeRoots();
    topLevelNodesOfSmall.each(function (ts) {
        if (ts instanceof go.Node) {

            diagramMain.model.addNodeData(ts.data);
        }
    });


    var highlighter =
        $(go.Part, "Auto",
            {
                layerName: "Background",
                selectable: false,
                isInDocumentBounds: false,
                locationSpot: go.Spot.Center
            },
            $(go.Shape, "Ellipse",
                {
                    fill: "deeppink",//$(go.Brush, "Radial", {0.0: "yellow", 1.0: "white"}),
                    stroke: null,
                    desiredSize: new go.Size(200, 200)
                })
        );
    diagramSmall.add(highlighter);


    diagramMain.add(
        $(go.Part, {location: new go.Point(-180, -120)},
            $(go.TextBlock, "Nothing selected", {font: "bold 24pt sans-serif", stroke: "green"})));

    // create the Overview and initialize it to show the main Diagram
    var myOverview =
        $(go.Overview, "diagramSmallOverview",
            {observed: diagramSmall});


    //showModel();
    //drawVisualTree();


}

function showModel() {
    document.getElementById("mySavedModel").textContent = diagramSmall.model.toJson();
}

function drawVisualTree() {

    var $ = go.GraphObject.make;  // for conciseness in defining templates
    // Now we can initialize a Diagram that looks at the visual tree that constitutes the Diagram above.


    myVisualTree =
        $(go.Diagram, "myVisualTree",
            {
                isReadOnly: true,  // do not allow users to modify or select in this view
                allowSelect: false,
                layout: $(go.TreeLayout, {nodeSpacing: 5})  // automatically laid out as a tree
            });

    myVisualTree.nodeTemplate =
        $(go.Node, "Auto",
            $(go.Shape, {fill: "darkkhaki", stroke: null}),  // assume a dark background
            $(go.TextBlock,
                {
                    font: "bold 13px Helvetica, bold Arial, sans-serif",
                    stroke: "black",
                    margin: 3
                },
                // bind the text to the Diagram/Layer/Part/GraphObject converted to a string
                new go.Binding("text", "", function (x) {
                    return x.toString();
                }))
        );

    myVisualTree.linkTemplate =
        $(go.Link,
            $(go.Shape, {stroke: "darkkhaki", strokeWidth: 2})
        );

    var visualNodeDataArray = [];

    // recursively walk the visual tree, collecting objects as we go
    function traverseVisualTree(obj, parent) {
        obj.key = visualNodeDataArray.length;
        visualNodeDataArray.push(obj);
        if (parent) {
            obj.parentKey = parent.key;
        }
        if (obj instanceof go.Diagram) {
            var lit = obj.layers;
            while (lit.next()) traverseVisualTree(lit.value, obj);
        } else if (obj instanceof go.Layer) {
            var pit = obj.parts;
            while (pit.next()) traverseVisualTree(pit.value, obj);
        } else if (obj instanceof go.Panel) {
            var eit = obj.elements;
            while (eit.next()) traverseVisualTree(eit.value, obj);
        }
    }

    traverseVisualTree(diagramMain, null);


    myVisualTree.model =
        go.GraphObject.make(go.TreeModel,
            {
                nodeParentKeyProperty: "parentKey",
                nodeDataArray: visualNodeDataArray
            });
}

function changeCategory(e, obj) {
    var node = obj.part;
    if (node) {
        var diagram = node.diagram;
        diagram.startTransaction("changeCategory");
        var cat = diagram.model.getCategoryForNodeData(node.data);
        if (cat === "start") {
            cat = "first";
        }

        else if (cat === "first") {
            cat = "start";
        }
        else {
            cat = "start";
        }

        diagram.model.setCategoryForNodeData(node.data, cat);
        diagram.commitTransaction("changeCategory");
    }
}

function layout() {

    diagramMain.model.nodeDataArray = [];
    diagramLeft.model.nodeDataArray = [];
    diagramTop.model.nodeDataArray = [];

    var topLevelNodesOfSmall = diagramSmall.findTreeRoots();
    topLevelNodesOfSmall.each(function (ts) {
        if (ts instanceof go.Node) {

            diagramMain.model.addNodeData(ts.data);
        }
    });

    //diagramMain.layoutDiagram(true);
}

function save() {
    document.getElementById("mySavedModel").value = diagramSmall.model.toJson();
    diagramSmall.isModified = false;
}

function load() {
    diagramSmall.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
}
