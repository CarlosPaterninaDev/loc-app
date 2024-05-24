import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NzTableModule } from 'ng-zorro-antd/table';
import { DataService } from './data.service';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, Observer } from 'rxjs';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';

export interface ResponseData {
  files: File[];
}

export interface File {
  path: string;
  stats: Summary;
  badFile: boolean;
}

export interface Summary {
  total: number;
  source: number;
  comment: number;
  single: number;
  block: number;
  mixed: number;
  empty: number;
  todo: number;
  blockEmpty: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NzTableModule,
    NzUploadModule,
    NzStepsModule,
    NzIconModule,
    NzDividerModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  public dataService = inject(DataService);

  private msg = inject(NzMessageService);
  loading = false;

  table = {
    physical: 0,
    source: 0,
    comment: 0,
    single: 0,
    block: 0,
    mixed: 0,
    empty: 0,
    blockEmpty:0,
    todo: 0,
  };

  listOfData: File[] = [];
  current = 0;

  steps = [
    {
      id: 1,
      title: 'Instalar libreria sloc',
      description: 'npm install sloc -D',
    },
    {
      id: 2,
      title: 'Ejecutar sloc',
      description:
        'npx sloc --details --format json --format-option no-head src/ > loc.json',
    },
    {
      id: 3,
      title: 'Cargar archivo',
      description: 'Cargar archivo loc.json en la caja de carga',
    },
    {
      id: 4,
      title: 'Explora tus archivo',
      description:
        'Explora tus archivo y observa la cantidad de lineas de codigo que tienes en tu proyecto',
    },
  ];

  listOfColumn: any[] = [
    {
      title: 'Path',
      compare: (a: File, b: File) => a.path.localeCompare(b.path),
      priority: false,
    },
    {
      title: 'Total',
      compare: (a: File, b: File) => a.stats.total > b.stats.total,
      priority: 2,
    },
    {
      title: 'Source',
      compare: (a: File, b: File) => a.stats.source - b.stats.source,
      priority: 3,
    },
    {
      title: 'Comment',
      compare: (a: File, b: File) => a.stats.comment - b.stats.comment,
      priority: 4,
    },
    {
      title: 'Single',
      compare: (a: File, b: File) => a.stats.single - b.stats.single,
      priority: 5,
    },
    {
      title: 'Block',
      compare: (a: File, b: File) => a.stats.block - b.stats.block,
      priority: 6,
    },
    {
      title: 'Mixed',
      compare: (a: File, b: File) => a.stats.mixed - b.stats.mixed,
      priority: 7,
    },
    {
      title: 'Empty',
      compare: (a: File, b: File) => a.stats.empty - b.stats.empty,
      priority: 8,
    },
    {
      title: 'Block Empty',
      compare: (a: File, b: File) => a.stats.blockEmpty - b.stats.blockEmpty,
      priority: false,
    },
    {
      title: 'Todo',
      compare: (a: File, b: File) => a.stats.todo - b.stats.todo,
      priority: false,
    },

  ];

  getFiles(): void {
    this.dataService.getFiles().subscribe((data) => {
      this.listOfData = data.files;
    });
  }

  selected() {
    this.current++;
  }

  beforeUpload = (
    file: NzUploadFile,
    _fileList: NzUploadFile[]
  ): Observable<boolean> =>
    new Observable((observer: Observer<boolean>) => {
      const isJson = file.type === 'application/json';
      if (!isJson) {
        this.msg.error('You can only upload JPG file!');
        observer.complete();
        return;
      }
      console.log(file);
      observer.next(isJson);
      observer.complete();
    });

  async handleChange(info: { file: NzUploadFile }): Promise<void> {
    console.log(info.file.status);
    const object: ResponseData = (await this.parseJsonFile(
      info.file.originFileObj
    )) as ResponseData;
    console.log(object);

    if (object.files) {
      this.listOfData = object.files;

      this.table = {
        physical: 0,
        source: 0,
        comment: 0,
        single: 0,
        block: 0,
        mixed: 0,
        empty: 0,
        blockEmpty: 0,
        todo: 0,
      };

      object.files.forEach((file) => {
        this.table.physical += file.stats.total;
        this.table.source += file.stats.source;
        this.table.comment += file.stats.comment;
        this.table.single += file.stats.single;
        this.table.block += file.stats.block;
        this.table.mixed += file.stats.mixed;
        this.table.empty += file.stats.empty;
        this.table.todo += file.stats.todo;
        this.table.blockEmpty += file.stats.blockEmpty;
      });

      this.msg.success('File uploaded successfully');
    } else {
      this.msg.error('Network error');
    }
  }

  async parseJsonFile(file: any) {
    console.log(file);
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = (event: any) =>
        resolve(JSON.parse(event.target.result));
      fileReader.onerror = (error) => reject(error);
      fileReader.readAsText(file);
    });
  }
}
