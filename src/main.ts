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
          title: "Bình An & Thanh Tuyền - Những ngày có nhau",
        },
        {
          path: "20-11",
          loadComponent: () =>
            import("./app/teachers-day.component").then(
              (m) => m.TeachersDayComponent,
            ),
          title: "20/11 - Gửi Thanh Tuyền, từ Bình An",
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
          title: `${title} - Bình An & Thanh Tuyền`,
        })),
        { path: "**", redirectTo: "" },
      ],
      withInMemoryScrolling({
        scrollPositionRestoration: "enabled",
      }),
    ),
  ],
}).catch((error) => console.error(error));
