from django.conf import settings
from django.shortcuts import render
from django.views.static import serve
from django.http import HttpResponse
import os
import yaml
import re
import json

from .utils import word_count


def react_app(request):
    return render(request, "index.html")


DOCTYPE_ALIASES = {
    "s": "stories",
    "a": "articles",
    "image": "images"
}


def document(request, work, doctype, docname, ext):
    return serve(
        request,
        f"{work}/{DOCTYPE_ALIASES[doctype]}/{docname}.{ext}",
        settings.STORIES_ROOT
    )


STORY_METADATA_FIELDS = {
    "location",
    "date"
}


def get_document_metadata(dirname, filename):
    filepath = os.path.join(dirname, filename)

    with open(filepath, "r") as fh:
        lines = fh.readlines()

    out = {"slug": filename[:-3]}
    for i in range(len(lines)):
        line = lines[i]
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

    out["word_count"] = word_count("\n".join(lines[i+1:]))

    if 'title' not in out:
        raise ValueError("Markdown file must have a title: " + filepath)

    return out


def markdown_files(dirname):
    out = []
    for filename in os.listdir(dirname):
        if filename.endswith(".md"):
            out.append(get_document_metadata(dirname, filename))
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

    output = json.dumps(data, indent=2, sort_keys=True)
    return HttpResponse(output, content_type="application/json")
