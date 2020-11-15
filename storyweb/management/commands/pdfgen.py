from django.core.management.base import BaseCommand
from fpdf import FPDF


class SerialPDF(FPDF):
    def __init__(self):
        super().__init__(
            self,
            unit="in",
            format=(6,9)
        )


class Command(BaseCommand):
    help = "Read and download relevant new emails"

    def add_arguments(self, parser):
        parser.add_argument("sequence", metavar="sequence", type=str,)
        # parser.add_argument("--time", metavar="timestamp", type=int,
        #                     help="The time stamp of the particular email you wish to scrape")
        # parser.add_argument("-p", action="store_true",
        #                     help="Prints out scraped information")
        # parser.add_argument("-s", metavar="timedelta", type=str,
        #                     default="7d",
        #                     help="How long ago to look")
        # parser.add_argument("-o", action="store_true",
        #                     help="Overrides last_read")

    def handle(self, *args, **options):
