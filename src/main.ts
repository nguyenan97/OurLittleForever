import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter, withInMemoryScrolling } from "@angular/router";
import { AppComponent } from "./app/app.component";

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(
      [
        {
          path: "",
          loadComponent: () =>
            import("./app/home.component").then((m) => m.HomeComponent),
          title: "Anh & Em - Những ngày có nhau",
        },
        {
          path: "20-11",
          loadComponent: () =>
            import("./app/teachers-day.component").then(
              (m) => m.TeachersDayComponent,
            ),
          title: "20/11 - Gửi cô giáo anh thương",
        },
        ...[
          { path: "chuyen-minh", section: "chuyen-minh", title: "Chuyện mình" },
          { path: "khoanh-khac", section: "khoanh-khac", title: "Khoảnh khắc" },
          { path: "loi-thuong", section: "thu", title: "Lời thương" },
        ].map(({ path, section, title }) => ({
          path,
          data: { section },
          loadComponent: () =>
            import("./app/home.component").then((m) => m.HomeComponent),
          title: `${title} - Anh & Em`,
        })),
        { path: "**", redirectTo: "" },
      ],
      withInMemoryScrolling({
        scrollPositionRestoration: "enabled",
      }),
    ),
  ],
}).catch((error) => console.error(error));
