from django.conf import settings
from django.shortcuts import render
from django.views.static import serve
from django.http import JsonResponse
import os
import yaml
import re
import urllib.parse


def react_app(request):
    return render(request, "index.html")


DOCTYPE_ALIASES = {
    "s": "stories",
    "a": "articles",
    "image": "images"
}


def document(request, work, doctype, docname):
    print(f"{work}/{DOCTYPE_ALIASES[doctype]}/{docname}")
    return serve(
        request,
        f"{work}/{DOCTYPE_ALIASES[doctype]}/{urllib.parse.unquote(docname)}",
        settings.STORIES_ROOT
    )


STORY_METADATA_FIELDS = {
    "location",
    "date"
}


def get_story_metadata(dirname, filename):
    filepath = os.path.join(dirname, filename)

    with open(filepath, "r") as fh:
        lines = fh.readlines()

    out = {"slug": filename[:-3]}
    for line in lines:
        if line.startswith("# "):
            out['title'] = line[2:].strip()
            break
        elif re.match('[A-Z][a-z]*: ', line):
            key, value = line.split(":", 1)
            key, value = key.strip().lower(), value.strip()
            out[key] = value
        elif line.strip() == "":
            pass
        else:
            raise ValueError("Markdown file must begin with optional metadata and then title: " + filepath)

    if 'title' not in out:
        raise ValueError("Markdown file must have a title: " + filepath)

    return out


def markdown_files(dirname):
    out = []
    for filename in os.listdir(dirname):
        if filename.endswith(".md"):
            out.append(get_story_metadata(dirname, filename))
    return out


def works_metadata(request):
    data = {}
    for work in os.listdir("works"):
        work_metadata = {}
        with open(os.path.join("works", work, "details.yml"), "r") as fh:
            work_metadata["details"] = yaml.load(fh, Loader=yaml.Loader)
        work_metadata["stories"] = markdown_files(os.path.join("works", work, "stories"))
        work_metadata["articles"] = markdown_files(os.path.join("works", work, "articles"))
        data[work] = work_metadata
    return JsonResponse(data)
