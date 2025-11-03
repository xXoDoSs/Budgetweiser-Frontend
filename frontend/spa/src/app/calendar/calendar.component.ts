import {Component, ViewChild, AfterViewInit} from "@angular/core";
import {
  DayPilot,
  DayPilotCalendarComponent,
  DayPilotMonthComponent,
  DayPilotNavigatorComponent
} from "@daypilot/daypilot-lite-angular";
import {DataService} from "./data.service";
import { DayPilotModule } from "@daypilot/daypilot-lite-angular";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
@Component({
  selector: 'calendar-component',
  standalone: true,
  imports: [DayPilotModule, CommonModule, FormsModule],
  templateUrl: './calendar.component.html' 
  ,
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements AfterViewInit {

  @ViewChild("month") month!: DayPilotMonthComponent;
 

  events: DayPilot.EventData[] = [];

  selectedMonth = DayPilot.Date.today().toString('MMMM yyyy');

  date = DayPilot.Date.today();

  contextMenu = new DayPilot.Menu({
    items: [
      {
        text: "Delete",
        onClick: args => {
          const event = args.source;
          const dp = event.calendar;
          dp.events.remove(event);
        }
      },
      {
        text: "Edit...",
        onClick: async args => {
          const event = args.source;
          const dp = event.calendar;

          const modal = await DayPilot.Modal.prompt("Edit event text:", event.data.text);
          dp.clearSelection();
          if (!modal.result) { return; }
          event.data.text = modal.result;
          dp.events.update(event);
        }
      },
      {
        text: "-"
      },
      {
        text: "Red",
        onClick: args => {
          const event = args.source;
          const dp = event.calendar;
          event.data.backColor = DataService.colors.red;
          dp.events.update(event);
        }
      },
      {
        text: "Green",
        onClick: args => {
          const event = args.source;
          const dp = event.calendar;
          event.data.backColor = DataService.colors.green;

          dp.events.update(event);
        }
      },
      {
        text: "Blue",
        onClick: args => {
          const event = args.source;
          const dp = event.calendar;
          event.data.backColor = DataService.colors.blue;

          dp.events.update(event);
        }
      },
      {
        text: "Yellow",
        onClick: args => {
          const event = args.source;
          const dp = event.calendar;
          event.data.backColor = DataService.colors.yellow;

          dp.events.update(event);
        }
      },

      {
        text: "Gray",
        onClick: args => {
          const event = args.source;
          const dp = event.calendar;
          event.data.backColor = DataService.colors.gray;

          dp.events.update(event);
        }
      }
    ]
  });

  configNavigator: DayPilot.NavigatorConfig = {
    showMonths: 3,
    cellWidth: 25,
    cellHeight: 25,
    onVisibleRangeChanged: args => {
      if (!this.month || !this.month.control) { return; }
      this.loadEvents();
    }
  };

  selectTomorrow() {
    this.date = DayPilot.Date.today().addDays(1);
  }

  changeDate(date: DayPilot.Date): void {
    this.configMonth.startDate = date;
    this.selectedMonth = date.toString('MMMM yyyy');
  }


  configMonth: DayPilot.MonthConfig = {
    visible: true,
    startDate: this.date,
    contextMenu: this.contextMenu,
    eventBarVisible: false,
    onTimeRangeSelected: this.onTimeRangeSelected.bind(this),
    onEventClick: this.onEventClick.bind(this),

  //Tag heute markiert
  onBeforeCellRender: (args: any) => { 
      const isToday = args.cell.start.getDatePart().equals(DayPilot.Date.today());
      if (isToday) {
        args.cell.cssClass = ((args.cell.cssClass ?? '') + ' today-ring').trim();
      }
    }
  };


  constructor(private ds: DataService) {
  }

  ngAfterViewInit(): void {
    this.viewMonth();
    this.updateMonth();
  }

  nextMonth(): void{
    this.date = this.date.addMonths(1);
    this.updateMonth();
  }

  previousMonth(): void{
    this.date = this.date.addMonths(-1);
    this.updateMonth();
  }


  updateMonth(): void{
    if (!this.month || !this.month.control) { return; }
    this.configMonth.startDate = this.date;
    this.selectedMonth = this.date.toString('MMMM yyyy');
    this.loadEvents();
    this.month.control.update(); 
  }


  loadEvents(): void {
    if (!this.month || !this.month.control) { return; }
    const from = this.month.control.visibleStart();
    const to = this.month.control.visibleEnd();
    this.ds.getEvents(from, to).subscribe(result => {
      this.events = result;
    });
  }

  viewMonth():void {
    this.configNavigator.selectMode = "Month";
    this.configMonth.visible = true;
  }

  onBeforeEventRender(args: any) {
      const dp = args.control;
      args.data.areas = [
        {
          top: 3,
          right: 3,
          width: 20,
          height: 20,
          symbol: "/icons/daypilot.svg#minichevron-down-2",
          fontColor: "#fff",
          toolTip: "Show context menu",
          action: "ContextMenu",
        },
        {
          top: 3,
          right: 25,
          width: 20,
          height: 20,
          symbol: "/icons/daypilot.svg#x-circle",
          fontColor: "#fff",
          action: "None",
          toolTip: "Delete event",
          onClick: async (args: any)   => {
            dp.events.remove(args.source);
          }
        }
      ];

      args.data.areas.push({
        bottom: 5,
        left: 5,
        width: 36,
        height: 36,
        action: "None",
        image: `https://picsum.photos/36/36?random=${args.data.id}`,
        style: "border-radius: 50%; border: 2px solid #fff; overflow: hidden;",
      });
  }

  async onTimeRangeSelected(args: any) {
    const modal = await DayPilot.Modal.prompt("Create a new event:", "Event 1");
    const dp = args.control;
    dp.clearSelection();
    if (!modal.result) { return; }
    dp.events.add(new DayPilot.Event({
      start: args.start,
      end: args.end,
      id: DayPilot.guid(),
      text: modal.result
    }));
  }

  async onEventClick(args: any) {
    const form = [
      {name: "Text", id: "text"},
      {name: "Start", id: "start", dateFormat: "MM/dd/yyyy", type: "datetime"},
      {name: "End", id: "end", dateFormat: "MM/dd/yyyy", type: "datetime"},
      {name: "Color", id: "backColor", type: "select", options: this.ds.getColors()},
    ];

    const data = args.e.data;

    const modal = await DayPilot.Modal.form(form, data);

    if (modal.canceled) {
      return;
    }

    const dp = args.control;

    dp.events.update(modal.result);
  }


}