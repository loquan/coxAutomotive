import { HttpClient } from '@angular/common/http';
import { Component,OnInit } from '@angular/core';





export interface dealerStruct{
  dealerId: number,
  name: string;
  vehicle:vehiclesData[],
}


export interface vehiclesData{
  vehicleId: number;
  year: number;
  make: string;
  model: string;

}


export interface vehiclesArray {
  vehicleIds:number[];

}

export interface   vehicleStruct {
  vehicleId: number;
  year: number;
  make: string;
  model: string;
  dealerId: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    
  public vehiclesIds:number[];
  public dealerId:string[];

  public dealers:any[]=[];
  public dealerFinal:any[]=[];
  constructor(private http:HttpClient){

  }
  ngOnInit(){

    let data=this.getDatasetId().subscribe(data => {
      let dataSetId = data.datasetId;
      this.getDatasetVehicle( dataSetId).subscribe(vehicles =>{
        this.vehiclesIds=vehicles.vehicleIds;
        let numberVehicle=this.vehiclesIds.length;
        let count=0;
        this.vehiclesIds.forEach(vehicle=>{

            this.getVehicleInfo(dataSetId,vehicle).subscribe( vehicleInfo =>{
                let dealerId:number=vehicleInfo.dealerId;
                let vehicleData:any={};
                if(this.dealers[dealerId]==null){
                    this.getDealerInfo(dataSetId,dealerId).subscribe(dealerInfo =>{
                    
                    if(this.dealers[dealerId]==null) 
                    {
                      this.dealers[dealerId]=dealerInfo;
                      this.dealers[dealerId].vehicle=[]; 
                    }
                    count++;   
                    vehicleData.vehicleId=vehicleInfo.vehicleId;
                    vehicleData.year=vehicleInfo.year;
                    vehicleData.make=vehicleInfo.make;  
                    vehicleData.model=vehicleInfo.model;
                    this.dealers[dealerId].vehicle.push(vehicleData);

                    if(count==numberVehicle){
                      this.rebuildJSON(this.dealers);                    
                        
                    }


                    });
                }
                else {
                    count++;
                    vehicleData.vehicleId=vehicleInfo.vehicleId;
                    vehicleData.year=vehicleInfo.year;
                    vehicleData.make=vehicleInfo.make;  
                    vehicleData.model=vehicleInfo.model;
                    this.dealers[dealerId].vehicle.push(vehicleData);
                    if(count==numberVehicle){
                     this.rebuildJSON(this.dealers);                    
                    }
                }    
              });
            })
  
      })


    });    

  }

  rebuildJSON(dealers:any[]){
    dealers.forEach(dealer => {
      this.dealerFinal.push(dealer);
      
    });
  
  }
  getDatasetId(){
    return this.http.get<any>('http://api.coxauto-interview.com/api/datasetId');
    
  }

  getDatasetVehicle(dataSetId:string){
    return this.http.get<vehiclesArray>('http://api.coxauto-interview.com/api/'+dataSetId+'/vehicles');
    
  }
  getVehicleInfo(dataSetId:string,vehicleId:number){
    return this.http.get< vehicleStruct >('http://api.coxauto-interview.com/api/'+dataSetId+'/vehicles/'+vehicleId);
  }

  getDealerInfo(dataSetId:string,dealerId:number){
    return this.http.get('http://api.coxauto-interview.com/api/'+dataSetId+'/dealers/'+dealerId);
  }

  




  title = 'CoxAutomotive';
}

