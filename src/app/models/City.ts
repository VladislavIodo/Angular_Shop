interface City {
  value: string;
  viewValue: string;
}

interface CityGroup {
  disabled?: boolean;
  name: string;
  city: City[];
}
